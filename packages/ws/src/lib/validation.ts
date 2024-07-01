import { z } from "zod";

export const socketBodySchema = z
  .object({
    id: z.number(),
    method: z.string(),
  })
  .passthrough();

export const subscribeBodySchema = socketBodySchema.extend({
  params: z.object({
    path: z.string(),
    input: z.any().optional(),
  }),
});

export const subscriptionSchema = z.object({
  id: dstring(),
  connectionId: dstring(),
  topic: dstring(),
});

export type SubscriptionItem = z.infer<typeof subscriptionSchema>;

function dstring() {
  return z
    .object({
      S: z.string(),
    })
    .transform((v) => v.S);
}

function dnumber() {
  return z
    .object({
      N: z.string(),
    })
    .transform((v) => Number(v.N));
}
