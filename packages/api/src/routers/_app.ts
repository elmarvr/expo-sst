import { router } from "../trpc";
import { authRouter } from "./auth";
import { chatRouter } from "./chats";
import { roomRouter } from "./rooms";
import { userRouter } from "./users";

export const appRouter = router({
  rooms: roomRouter,
  chats: chatRouter,
  auth: authRouter,
  users: userRouter,
});

export type AppRouter = typeof appRouter;
