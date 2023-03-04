import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { Construct } from 'constructs'

interface ApiGatewayLambdaProps extends StackProps {
  path?: string
  lambdaProps?: Partial<lambda.FunctionProps>
}

export class ApiGatewayLambda extends Construct {
  public readonly defaultApi: lambda.Function
  public readonly deleteApi: lambda.Function
  public readonly getApi: lambda.Function
  public readonly httpApi: apigwv2.HttpApi
  public readonly postApi: lambda.Function
  public readonly putApi: lambda.Function

  public constructor(scope: Construct, id: string, props?: ApiGatewayLambdaProps) {
    super(scope, id)

    const lambdaProps: Partial<lambda.FunctionProps> = {
      architecture: lambda.Architecture.X86_64,
      environment: {
        REGION: Stack.of(this).region,
        ...(props?.lambdaProps?.environment ?? {}),
      },
      ...(props?.lambdaProps ?? {}),
    }

    this.defaultApi = new lambda.Function(this, 'DefaultApi', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./bundle/defaultApi'),
      handler: 'index.handler',
      ...lambdaProps,
    })
    this.getApi = new lambda.Function(this, 'GetApi', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./bundle/getApi'),
      handler: 'index.handler',
      ...lambdaProps,
    })
    this.postApi = new lambda.Function(this, 'PostApi', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./bundle/postApi'),
      handler: 'index.handler',
      ...lambdaProps,
    })
    this.putApi = new lambda.Function(this, 'PutApi', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./bundle/putApi'),
      handler: 'index.handler',
      ...lambdaProps,
    })
    this.deleteApi = new lambda.Function(this, 'DeleteApi', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./bundle/deleteApi'),
      handler: 'index.handler',
      ...lambdaProps,
    })

    const path = props?.path ?? '/api'
    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', this.defaultApi),
    })
    this.httpApi = httpApi
    httpApi.addRoutes({
      path,
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetIntegration', this.getApi),
    })
    httpApi.addRoutes({
      path,
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('PostIntegration', this.postApi),
    })
    httpApi.addRoutes({
      path,
      methods: [apigwv2.HttpMethod.PUT],
      integration: new HttpLambdaIntegration('PutIntegration', this.putApi),
    })
    httpApi.addRoutes({
      path,
      methods: [apigwv2.HttpMethod.DELETE],
      integration: new HttpLambdaIntegration('DeleteIntegration', this.deleteApi),
    })
  }
}
