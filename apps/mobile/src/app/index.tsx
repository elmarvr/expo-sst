import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '~/components/Button';
import { api } from '~/lib/api';
import { useAuth } from '~/lib/auth';

export default function Home() {
  const { signIn } = useAuth();

  const { data } = api.auth.currentUser.useQuery();

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View>
        <Text>{JSON.stringify(data, null, 2)}</Text>
        <Button title="Sign In" onPress={() => signIn()} />
      </View>
    </>
  );
}
