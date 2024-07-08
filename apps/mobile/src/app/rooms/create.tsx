import { Avatar, Button } from '@acme/ui';
import { Stack } from 'expo-router';
import { FlatList, View, Text } from 'react-native';

import { api } from '~/lib/api';

export default function Create() {
  const { data: users } = api.users.list.useQuery(undefined, {
    initialData: [],
  });

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Create room',
        }}
      />

      <FlatList
        data={users}
        keyExtractor={(user) => `${user.id}`}
        renderItem={({ item: user }) => {
          return (
            <View className="flex-row items-center px-2">
              <Avatar size="sm" className="mr-2">
                <Avatar.Image source={{ uri: user.avatar ?? undefined }} />
              </Avatar>
              <Text className="font-medium">{user.name}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
