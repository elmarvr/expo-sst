import "sst";
declare module "sst" {
  export interface Resource {
    DatabaseAuthToken: {
      type: "sst.sst.Secret";
      value: string;
    };
    DatabaseUrl: {
      type: "sst.sst.Secret";
      value: string;
    };
  }
}
export {};
