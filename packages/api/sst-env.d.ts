/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Bucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    Postgres: {
      clusterArn: string
      database: string
      secretArn: string
      type: "sst.aws.Postgres"
    }
    UserPool: {
      id: string
      type: "sst.aws.CognitoUserPool"
    }
  }
}
export {}