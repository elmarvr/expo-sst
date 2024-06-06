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

    const api = new sst.aws.Function("Api", {
      url: true,
      link: [rds],
      handler: "packages/api/src/index.handler",
    });

    return {
      api: api.url,
    };
  },
});
