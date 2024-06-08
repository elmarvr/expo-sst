/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "acme",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("Vpc", {});
    const rds = new sst.aws.Postgres("Postgres", { vpc });

    const bucket = new sst.aws.Bucket("Bucket", {
      public: true,
    });

    const userPool = new sst.aws.CognitoUserPool("UserPool", {
      usernames: ["email"],
    });
    const client = userPool.addClient("Mobile");
    const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
      userPools: [
        {
          userPool: userPool.id,
          client: client.id,
          vpc,
        },
      ],
    });

    const api = new sst.aws.Function("Api", {
      url: true,
      link: [rds, userPool, bucket],
      environment: {
        COGNTIO_CLIENT_ID: client.id,
      },
      handler: "packages/api/src/index.handler",
    });

    return {
      UserPool: userPool.id,
      Client: client.id,
      IdentityPool: identityPool.id,
      Api: api.url,
    };
  },
});
