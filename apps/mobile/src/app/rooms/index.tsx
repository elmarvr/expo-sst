import { Avatar, Button } from '@acme/ui';
import { Stack, useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { api } from '~/lib/api';

export default function Rooms() {
  const { data: rooms } = api.rooms.list.useQuery(undefined, {
    initialData: [],
  });

  const router = useRouter();

  return (
    <View className="w-full flex-1 items-center bg-red-500">
      <Stack.Screen
        options={{
          title: 'Rooms',

          headerRight: (props) => {
            return (
              <Button
                variant="ghost"
                onPress={() => {
                  router.push('rooms/create');
                }}>
                <Button.Text>Create</Button.Text>
              </Button>
            );
          },
        }}
      />
      {/* <View className="w-full flex-1 items-center bg-red-500"> */}
      {/* <FlatList
          data={rooms}
          keyExtractor={(room) => `${room.id}`}
          renderItem={({ item: room }) => {
            return (
              <View>
                <Text>{room.name}</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View>
              <Text>No rooms</Text>
            </View>
          }
        /> */}
      <Text>test</Text>
      {/* </View> */}
    </View>
  );
}
