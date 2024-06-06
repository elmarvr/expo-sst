import { Resource } from "sst";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { todo } from "./schema/common";

const client = new RDSDataClient({});

export const table = {
  todo,
};

export const db = drizzle(client, {
  database: Resource.Postgres.database,
  secretArn: Resource.Postgres.secretArn,
  resourceArn: Resource.Postgres.clusterArn,

  schema: table,
});
