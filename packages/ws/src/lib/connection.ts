import {
  ApiGatewayManagementApi,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/rpc";
import superjson from "superjson";

export class Connection {
  private connectionId: string;
  private apiG: ApiGatewayManagementApi;

  constructor(opts: { connectionId: string; endpoint: string }) {
    this.connectionId = opts.connectionId;
    this.apiG = new ApiGatewayManagementApi({
      endpoint: opts.endpoint,
    });
  }

  async error(opts: {
    id?: number;
    path?: string;
    error: ConstructorParameters<typeof TRPCError>[0];
  }) {
    const trpcError = new TRPCError(opts.error);

    const command = new PostToConnectionCommand({
      ConnectionId: this.connectionId,
      Data: JSON.stringify({
        id: opts.id,
        error: {
          message: trpcError.message,
          code: TRPC_ERROR_CODES_BY_KEY[trpcError.code],
          data: {
            code: trpcError.code,
            path: opts.path,
            stack: trpcError.stack,
            statusCode: 401,
          },
        },
      }),
    });

    return this.apiG.send(command);
  }

  send(id: string, payload: ConnectionPayload) {
    const result: Record<string, unknown> = {
      type: payload.type,
      data: undefined,
    };

    if (payload.type === "data") {
      result.data = superjson.serialize(payload.data);
    }

    const command = new PostToConnectionCommand({
      ConnectionId: this.connectionId,
      Data: JSON.stringify({
        id,
        result,
      }),
    });

    return this.apiG.send(command);
  }

  async start(id: string) {
    this.send(id, { type: "started" });
  }

  async stop(id: string) {
    this.send(id, { type: "stopped" });
  }
}

type ConnectionPayload =
  | {
      type: "started" | "stopped";
    }
  | {
      type: "data";
      data: unknown;
    };
