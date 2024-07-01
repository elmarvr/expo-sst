import {
  DeleteItemCommand,
  DynamoDB,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { SubscriptionItem, subscriptionSchema } from "./validation";

export class Subscription {
  private dynamo = new DynamoDB({});

  async create(item: SubscriptionItem) {
    const command = new PutItemCommand({
      TableName: Resource.Subscription.name,
      Item: {
        id: { S: `${item.id}` },
        connectionId: { S: item.connectionId },
        topic: { S: item.topic },
      },
    });

    return this.dynamo.send(command);
  }

  async remove(item: Pick<SubscriptionItem, "id" | "connectionId">) {
    const command = new DeleteItemCommand({
      TableName: Resource.Subscription.name,
      Key: {
        id: { S: `${item.id}` },
        connectionId: { S: item.connectionId },
      },
    });

    return this.dynamo.send(command);
  }

  async removeByConnectionId(connectionId: string) {
    const command = new DeleteItemCommand({
      TableName: Resource.Subscription.name,
      Key: {
        connectionId: { S: connectionId },
      },
    });

    return this.dynamo.send(command);
  }

  async getByTopic(topic: string) {
    const command = new QueryCommand({
      TableName: Resource.Subscription.name,
      IndexName: "TopicIndex",
      KeyConditionExpression: "topic = :topic",
      ExpressionAttributeValues: {
        ":topic": { S: topic },
      },
    });

    const output = await this.dynamo.send(command);

    return subscriptionSchema.array().parse(output.Items ?? []);
  }
}
