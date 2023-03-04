import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { ApiGatewayLambda } from '../lib/apigateway-lambda'

export class CdkBasicsApiGatewayLambdaStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const environment = {
      REGION: Stack.of(this).region,
    }
    const apiGatewayLambda = new ApiGatewayLambda(this, 'ApiGatewayLambda', {
      defaultApi: {
        id: 'DefaultApi',
        lambdaProps: {
          architecture: lambda.Architecture.X86_64,
          runtime: lambda.Runtime.NODEJS_18_X,
          code: lambda.Code.fromAsset('./bundle/defaultApi'),
          handler: 'index.handler',
          environment,
        },
      },
      apiMappings: {
        '/query': {
          'get|head': {
            id: 'GetApi',
            lambdaProps: {
              architecture: lambda.Architecture.X86_64,
              runtime: lambda.Runtime.NODEJS_18_X,
              code: lambda.Code.fromAsset('./bundle/getApi'),
              handler: 'index.handler',
              environment,
            },
          },
        },
        '/mutate': {
          post: {
            id: 'PostApi',
            lambdaProps: {
              architecture: lambda.Architecture.X86_64,
              runtime: lambda.Runtime.NODEJS_18_X,
              code: lambda.Code.fromAsset('./bundle/postApi'),
              handler: 'index.handler',
              environment,
            },
          },
          put: {
            id: 'PutApi',
            lambdaProps: {
              architecture: lambda.Architecture.X86_64,
              runtime: lambda.Runtime.NODEJS_18_X,
              code: lambda.Code.fromAsset('./bundle/putApi'),
              handler: 'index.handler',
              environment,
            },
          },
          delete: {
            id: 'DeleteApi',
            lambdaProps: {
              architecture: lambda.Architecture.X86_64,
              runtime: lambda.Runtime.NODEJS_18_X,
              code: lambda.Code.fromAsset('./bundle/deleteApi'),
              handler: 'index.handler',
              environment,
            },
          },
        },
      },
    })

    new CfnOutput(this, 'ApiEndpoint', {
      value: apiGatewayLambda.httpApi.apiEndpoint,
    })
  }
}
