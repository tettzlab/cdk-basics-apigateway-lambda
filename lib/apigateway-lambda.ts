import { StackProps } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import {
  HttpLambdaIntegration,
  HttpLambdaIntegrationProps,
  HttpUrlIntegration,
  HttpUrlIntegrationProps,
} from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { Construct } from 'constructs'

interface ApiBackend {
  id: string
  existingLambda?: lambda.IFunction
  lambdaProps?: lambda.FunctionProps
  lambdaIntegrationProps?: HttpLambdaIntegrationProps
  url?: string
  urlIntegrationProps?: HttpUrlIntegrationProps
}

interface MethodMappings {
  [methods: string]: ApiBackend
}

export interface ApiGatewayLambdaProps extends StackProps {
  httpApiProps?: apigwv2.HttpApiProps
  defaultApi?: ApiBackend
  apiMappings?: {
    [path: string]: MethodMappings
  }
}

export class ApiGatewayLambda extends Construct {
  public readonly apiMappings: {
    [id: string]: lambda.Function | lambda.IFunction
  }
  public readonly httpApi: apigwv2.HttpApi

  public constructor(scope: Construct, id: string, props?: ApiGatewayLambdaProps) {
    super(scope, id)

    this.apiMappings = {}

    const createIntegration = (backend: ApiBackend): apigwv2.HttpRouteIntegration => {
      const { id, existingLambda, lambdaProps, lambdaIntegrationProps, url, urlIntegrationProps } =
        backend
      let ret: apigwv2.HttpRouteIntegration | undefined
      if (existingLambda) {
        if (lambdaProps || url) {
          throw new Error(
            'Invalid ApiGatewayLambdaProps: you should provide only one of `existingLambda`, `lambdaProps`, or `url`.'
          )
        }
        this.apiMappings[id] = existingLambda
        ret = new HttpLambdaIntegration(id, existingLambda, lambdaIntegrationProps)
      }
      if (lambdaProps) {
        if (existingLambda || url) {
          throw new Error(
            'Invalid ApiGatewayLambdaProps: you should provide only one of `existingLambda`, `lambdaProps`, or `url`.'
          )
        }
        const func = new lambda.Function(this, `${id}Function`, lambdaProps)
        this.apiMappings[id] = func
        ret = new HttpLambdaIntegration(id, func, lambdaIntegrationProps)
      }
      if (url) {
        if (existingLambda || lambdaProps) {
          throw new Error(
            'Invalid ApiGatewayLambdaProps: you should provide only one of `existingLambda`, `lambdaProps`, or `url`.'
          )
        }
        ret = new HttpUrlIntegration(id, url, urlIntegrationProps)
      }
      if (ret == null) {
        throw new Error(
          'Invalid ApiGatewayLambdaProps: you should provide one of `existingLambda`, `lambdaProps`, or `url`.'
        )
      }
      return ret
    }

    let defaultApi: apigwv2.HttpRouteIntegration | undefined
    if (props?.defaultApi != null) {
      defaultApi = createIntegration(props.defaultApi)
    }

    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      ...(props?.httpApiProps ?? {}),
      ...(defaultApi
        ? {
            defaultIntegration: defaultApi,
          }
        : {}),
    })
    this.httpApi = httpApi

    const apiMappings = props?.apiMappings ?? {}
    for (const path in apiMappings) {
      const api = apiMappings[path]
      for (const methodNames in api) {
        const methods = methodNames
          .split('|')
          .map((m) => m.trim().toUpperCase())
          .filter((m) => Object.values(apigwv2.HttpMethod).includes(m as apigwv2.HttpMethod))
        if (methods.length === 0) {
          throw new Error() //FIXME
        }
        const integration = createIntegration(api[methodNames])
        httpApi.addRoutes({
          path: path,
          methods: methods as apigwv2.HttpMethod[],
          integration: integration,
        })
      }
    }
  }
}
