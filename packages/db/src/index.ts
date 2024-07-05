import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { Resource } from "sst";
import * as common from "./schema/common";
import * as auth from "./schema/auth";

const client = createClient({
  url: Resource.DatabaseUrl.value,
  authToken: Resource.DatabaseAuthToken.value,
});

export const table = {
  ...auth,
  ...common,
};

export const db = drizzle(client, {
  schema: table,
});

export * from "drizzle-orm/pg-core/expressions";
