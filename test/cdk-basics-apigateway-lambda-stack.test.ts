import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import * as CdkApp from '../stack/cdk-basics-apigateway-lambda-stack'

describe('CdkBasicsApiGatewayLambdaStack', () => {
  const app = new cdk.App()
  const stack = new CdkApp.CdkBasicsApiGatewayLambdaStack(app, 'MyTestStack')

  test('should have 5 lambda functions.', () => {
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 5)
  })
})
