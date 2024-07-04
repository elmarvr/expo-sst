import { Procedure, Router } from "@trpc/server";
import {
  createRecursiveProxy,
  inferTransformedSubscriptionOutput,
} from "@trpc/server/shared";
import { Subscription } from "./subscription";
import { Connection } from "./connection";
import { Resource } from "sst";
import { ApiGatewayManagementApiServiceException } from "@aws-sdk/client-apigatewaymanagementapi";
import { SubscriptionItem } from "./validation";

export function createEmitter<
  TRouter extends Router<any>,
>(): CreateEmitter<TRouter> {
  return createRecursiveProxy(async ({ path, args }) => {
    const pathStr = path.join(".");

    if (args) {
      const S = new Subscription();

      const subscriptions = await S.getByTopic(pathStr);

      function post({ id, connectionId }: SubscriptionItem) {
        const C = new Connection({
          connectionId,
          endpoint: Resource.Websocket.url.replace("wss://", "https://"),
        });

        try {
          return C.send(id, {
            type: "data",
            data: args[0],
          });
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

export type CreateEmitter<TRouter extends Router<any>> = CreateEmitterInner<
  TRouter["_def"]["procedures"]
>;

export type CreateEmitterInner<T> = {
  [TKey in keyof T as HasSubscriptions<T[TKey]> extends true
    ? TKey
    : never]: T[TKey] extends Procedure<"subscription", any>
    ? (payload: inferTransformedSubscriptionOutput<T[TKey]>) => void
    : T[TKey] extends Router<infer _Def>
      ? CreateEmitterInner<_Def["record"]>
      : never;
};

export type HasSubscriptions<T> =
  T extends Router<infer _Def>
    ? true extends {
        [TKey in keyof _Def["record"]]: HasSubscriptions<_Def["record"][TKey]>;
      }[keyof _Def["record"]]
      ? true
      : false
    : T extends Procedure<"subscription", any>
      ? true
      : false;
