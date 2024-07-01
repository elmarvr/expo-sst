import type { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";

import { Subscription } from "./lib/subscription";
import { Connection } from "./lib/connection";
import { socketBodySchema, subscribeBodySchema } from "./lib/validation";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
  const { stage, domainName, connectionId } = event.requestContext;

  console.log({ stage, domainName, connectionId });

  if (!event.body) {
    return { statusCode: 400, body: "No Data" };
  }

  const body = JSON.parse(event.body);

  if (Array.isArray(body) && body.length === 0) {
    return { statusCode: 200, body: "No Message" };
  }

  const C = new Connection({
    connectionId,
    endpoint: `https://${domainName}/${stage}`,
  });

  const result = socketBodySchema.safeParse(body);

  if (!result.success) {
    C.error({
      error: {
        code: "BAD_REQUEST",
        message: result.error.message,
      },
    });

    return { statusCode: 400, body: result.error.message };
  }

  const { id, method } = result.data;

  const S = new Subscription();

  switch (method) {
    case "subscription": {
      const result = subscribeBodySchema.safeParse(body);

      if (!result.success) {
        C.error({
          error: {
            code: "BAD_REQUEST",
            message: result.error.message,
          },
        });

        return { statusCode: 400, body: result.error.message };
      }

      const { path } = result.data.params;

      await S.create({ id, connectionId, topic: path });

      await C.start(id);

      return { statusCode: 200, body: "Subscribed" };
    }
    case "subscription.stop": {
      await S.remove({
        id,
        connectionId,
      });
      await C.stop(id);

      return { statusCode: 200, body: "Unsubscribed" };
    }
  }

  return { statusCode: 200, body: "Message sent" };
};
