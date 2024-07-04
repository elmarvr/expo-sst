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
    const client = userPool.addClient("Mobile", {
      transform: {
        client: {
          idTokenValidity: 1,
        },
      },
    });

    const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
      userPools: [
        {
          userPool: userPool.id,
          client: client.id,
        },
      ],
    });

    const subscriptionTable = new sst.aws.Dynamo("Subscription", {
      fields: {
        id: "number",
        connectionId: "string",
        topic: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        connectionIdIndex: { hashKey: "connectionId" },
        TopicIndex: { hashKey: "topic" },
      },
    });

    const ws = new sst.aws.ApiGatewayWebSocket("Websocket", {
      transform: {
        route: {
          handler: (args) => {
            args.link = [subscriptionTable, ws];
          },
        },
      },
    });

    ws.route("$disconnect", "packages/ws/src/disconnect.handler");
    ws.route("$default", "packages/ws/src/message.handler");

    const api = new sst.aws.Function("Api", {
      url: true,
      link: [rds, userPool, bucket, ws, subscriptionTable],
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
      WS: ws.url,
    };
  },
});
