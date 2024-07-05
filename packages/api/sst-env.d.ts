/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Bucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    DatabaseAuthToken: {
      type: "sst.sst.Secret"
      value: string
    }
    DatabaseUrl: {
      type: "sst.sst.Secret"
      value: string
    }
    Subscription: {
      name: string
      type: "sst.aws.Dynamo"
    }
    UserPool: {
      id: string
      type: "sst.aws.CognitoUserPool"
    }
    Websocket: {
      managementEndpoint: string
      type: "sst.aws.ApiGatewayWebSocket"
      url: string
    }
  }
}
export {}