import { Context, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

const region: string = process.env.REGION ?? ''

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> {
  if (!region) {
    throw new Error(`Invalid process.env.REGION: ${region}`)
  }
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`)
    console.log(`Context: ${JSON.stringify(context, null, 2)}`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world from default api',
      }),
    }
  } catch (err: unknown) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    }
  }
}

// const testEvent: APIGatewayProxyEventV2 = {
//   version: '2.0',
//   routeKey: '$default',
//   rawPath: '/api',
//   rawQueryString: 'param1=value1&param2=value2&param3=value3',
//   headers: {
//     accept:
//       'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
//     'accept-encoding': 'gzip, deflate, br',
//     'accept-language': 'en-US,en;q=1,0',
//     'content-length': '0',
//     host: 'xxxxxxxxxx.execute-api.us-east-1.amazonaws.com',
//     'upgrade-insecure-requests': '1',
//     'user-agent': 'Mozilla/5.0 (...)',
//     'x-forwarded-for': '1.2.3.4',
//     'x-forwarded-port': '443',
//     'x-forwarded-proto': 'https',
//   },
//   queryStringParameters: {
//     param1: 'value1',
//     param2: 'value2',
//     param3: 'value3',
//   },
//   requestContext: {
//     accountId: '123456789012',
//     apiId: 'xxxxxxxxxx',
//     // authorizer: {
//     //   claims: null,
//     //   scopes: null,
//     // },
//     domainName: 'xxxxxxxxxx.execute-api.us-east-1.amazonaws.com',
//     domainPrefix: 'xxxxxxxxxx',
//     http: {
//       method: 'GET',
//       path: '/api',
//       protocol: 'HTTP/1.1',
//       sourceIp: '1.2.3.4',
//       userAgent: 'Mozilla/5.0 (...)',
//     },
//     // identity: {
//     //   accessKey: null,
//     //   accountId: null,
//     //   caller: null,
//     //   cognitoAuthenticationProvider: null,
//     //   cognitoAuthenticationType: null,
//     //   cognitoIdentityId: null,
//     //   cognitoIdentityPoolId: null,
//     //   principalOrgId: null,
//     //   sourceIp: 'IP',
//     //   user: null,
//     //   userAgent: 'user-agent',
//     //   userArn: null,
//     //   clientCert: {
//     //     clientCertPem: 'CERT_CONTENT',
//     //     subjectDN: 'www.example.com',
//     //     issuerDN: 'Example issuer',
//     //     serialNumber: 'a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1',
//     //     validity: {
//     //       notBefore: 'May 28 12:30:02 2019 GMT',
//     //       notAfter: 'Aug  5 09:36:04 2021 GMT',
//     //     },
//     //   },
//     // },
//     requestId: 'XXXXXXXXXXXXXXX',
//     routeKey: '$default',
//     stage: '$default',
//     time: '01/Jan/2099:09:09:09 +0000',
//     timeEpoch: 1699999999999,
//   },
//   isBase64Encoded: false,
// }
// ;(async function () {
//   await handler(testEvent, {} as Context)
// })()
