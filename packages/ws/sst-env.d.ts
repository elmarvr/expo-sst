/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Subscription: {
      name: string
      type: "sst.aws.Dynamo"
    }
    Websocket: {
      managementEndpoint: string
      type: "sst.aws.ApiGatewayWebSocket"
      url: string
    }
  }
}
export {}