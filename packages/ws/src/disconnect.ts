import { APIGatewayProxyHandler } from "aws-lambda";
import { Subscription } from "./lib/subscription";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { connectionId } = event.requestContext;

  const subscription = new Subscription();

  if (connectionId) await subscription.removeByConnectionId(connectionId);

  return { statusCode: 200, body: "Disconnected" };
};
