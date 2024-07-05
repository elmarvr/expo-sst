import { Resource } from "sst";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: Resource.DatabaseUrl.value,
    authToken: Resource.DatabaseAuthToken.value,
  },

  // Pick up all our schema files
  schema: ["./src/schema/*.ts"],
  out: "./migrations",
});
