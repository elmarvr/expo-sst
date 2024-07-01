import type { AppRouter } from '@acme/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCReact,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';

import { authStore } from './storage';

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider(props: { children: React.ReactNode }) {
  console.log(`${process.env.EXPO_PUBLIC_WS_API_URL}/$default`);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        // loggerLink(),
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          true: wsLink({
            client: createWSClient({
              url: `${process.env.EXPO_PUBLIC_WS_API_URL}/$default`,
              onClose() {
                console.log('Socket Connection Closed');
              },
              onOpen() {
                console.log('Socket Connection Opened');
              },
            }),
          }),
          false: httpBatchLink({
            url: process.env.EXPO_PUBLIC_API_URL!,
            async headers() {
              const token = await authStore.getItem('sessionToken');

              return {
                Authorization: `Bearer ${token}`,
              };
            },
          }),
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </api.Provider>
  );
}
