import { Avatar } from '@acme/ui';
import { Stack } from 'expo-router';
import { FlatList, View, Text } from 'react-native';

import { api } from '~/lib/api';

export default function Create() {
  const { data: users } = api.users.list.useQuery(undefined, {
    initialData: [],
  });

  return (
    <View>
      <Stack.Screen options={{ title: 'Rooms' }} />

      <FlatList
        data={users}
        keyExtractor={(user) => `${user.id}`}
        renderItem={({ item: user }) => {
          return (
            <View className="flex-row items-center">
              <Avatar>
                <Avatar.Image source={{ uri: user.avatar ?? undefined }} />
              </Avatar>
              <Text>{user.name}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
