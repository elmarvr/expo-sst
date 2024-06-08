import { Resource } from "sst";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { todo } from "./schema/common";
import { session, user, sessionRelations } from "./schema/auth";

const client = new RDSDataClient({});

export const table = {
  //auth
  user,
  session,
  sessionRelations,

  //common
  todo,
};

export const db = drizzle(client, {
  database: Resource.Postgres.database,
  secretArn: Resource.Postgres.secretArn,
  resourceArn: Resource.Postgres.clusterArn,

  schema: table,
});

export * from "drizzle-orm/pg-core/expressions";
