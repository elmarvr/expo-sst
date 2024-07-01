import { ProcedureRecord, Router } from "@trpc/server";
import {
  createRecursiveProxy,
  inferTransformedSubscriptionOutput,
} from "@trpc/server/shared";
import { Subscription } from "./subscription";
import { Connection } from "./connection";
import { Resource } from "sst";
import { ApiGatewayManagementApiServiceException } from "@aws-sdk/client-apigatewaymanagementapi";
import { SubscriptionItem } from "./validation";

export type CreateEmitter<TRouter extends Router<any>> = CreateEmitterInner<
  TRouter["_def"]["procedures"]
>;

type CreateEmitterInner<TProcedures extends ProcedureRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends Router<any>
    ? CreateEmitterInner<TProcedures[TKey]["_def"]["procedures"]>
    : {
        emit: (
          payload: inferTransformedSubscriptionOutput<TProcedures[TKey]>
        ) => void;
      };
};

export function createEmitter<
  TRouter extends Router<any>,
>(): CreateEmitter<TRouter> {
  return createRecursiveProxy(async ({ path, args }) => {
    const pathCopy = [...path];
    const lastArg = pathCopy.pop()!;
    const pathStr = pathCopy.join(".");

    if (lastArg === "emit") {
      const S = new Subscription();

      const subscriptions = await S.getByTopic(pathStr);

      function post({ id, connectionId }: SubscriptionItem) {
        const C = new Connection({
          connectionId,
          endpoint: Resource.Websocket.url.replace("wss://", "https://"),
        });

        try {
          return C.send(id, args[0]);
        } catch (error) {
          if (error instanceof ApiGatewayManagementApiServiceException) {
            S.remove({
              id,
              connectionId,
            });
          }
        }
      }

      await Promise.all(subscriptions.map(post));
    }
  }) as CreateEmitter<TRouter>;
}
