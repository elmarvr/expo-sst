import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { Resource } from "sst";
import * as common from "./schema/common";
import * as auth from "./schema/auth";

const client = new RDSDataClient({});

export const table = {
  ...auth,
  ...common,
};

export const db = drizzle(client, {
  database: Resource.Postgres.database,
  secretArn: Resource.Postgres.secretArn,
  resourceArn: Resource.Postgres.clusterArn,

  schema: table,
});

export * from "drizzle-orm/pg-core/expressions";
