import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import { createContext } from "./context";
import { AppRouter, appRouter } from "./routers/_app";

import { createEmitter } from "@acme/ws/emitter";

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export type { AppRouter } from "./routers/_app";

const ws = createEmitter<AppRouter>();
