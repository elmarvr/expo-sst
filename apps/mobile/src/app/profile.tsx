// import { Avatar, AvatarFallback, AvatarImage, Input, Label } from '@acme/ui';
import { Stack } from 'expo-router';
import React from 'react';
// import { View } from 'react-native';

import { api } from '~/lib/api';

export default function Home() {
  const { data } = api.auth.currentUser.useQuery();

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      {/* 
      <View className="items-center gap-y-3 p-4">
        <Avatar alt="Test test test" className="size-24">
          <AvatarImage src={data?.avatar ?? undefined} />
          <AvatarFallback />
        </Avatar>

        <View className="w-full gap-y-1">
          <Label nativeID="email">Email</Label>
          <Input nativeID="email" placeholder="Email" defaultValue={data?.email} />
        </View>
      </View> */}
    </>
  );
}
