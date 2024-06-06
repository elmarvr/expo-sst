import { Resource } from "sst";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  driver: "aws-data-api",
  dialect: "postgresql",
  dbCredentials: {
    database: Resource.Postgres.database,
    secretArn: Resource.Postgres.secretArn,
    resourceArn: Resource.Postgres.clusterArn,
  },
  // Pick up all our schema files
  schema: ["./src/schema/*.ts"],
  out: "./migrations",
});
