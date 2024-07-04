import { Stack } from 'expo-router';
import React from 'react';

import { api } from '~/lib/api';

export default function Home() {
  const { data } = api.auth.currentUser.useQuery();

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      {JSON.stringify(data)}
    </>
  );
}
