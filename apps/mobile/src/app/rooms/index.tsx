import { Stack } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { api } from '~/lib/api';

export default function Rooms() {
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
          return <Text>{user.name}</Text>;
        }}
      />
    </View>
  );
}
