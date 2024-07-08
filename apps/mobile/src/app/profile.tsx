import { Stack } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { api } from '~/lib/api';

export default function Home() {
  const { data } = api.auth.currentUser.useQuery();

  return (
    <>
      <Text>{JSON.stringify(data)}</Text>
    </>
  );
}
