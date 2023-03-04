import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ApiGatewayLambda } from '../lib/apigateway-lambda'

export class CdkBasicsApiGatewayLambdaStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const apiGatewayLambda = new ApiGatewayLambda(this, 'ApiGatewayLambda')

    new CfnOutput(this, 'ApiEndpoint', {
      value: apiGatewayLambda.httpApi.apiEndpoint,
    })
  }
}
