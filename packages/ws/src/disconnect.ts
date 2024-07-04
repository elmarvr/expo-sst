import { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";
import { Subscription } from "./lib/subscription";

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
  const { connectionId } = event.requestContext;

  const subscription = new Subscription();

  await subscription.removeByConnectionId(connectionId);

  return { statusCode: 200, body: "Disconnected" };
};
