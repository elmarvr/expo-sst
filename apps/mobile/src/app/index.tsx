import { Input } from '@acme/ui';
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      <View className="gap-y-1.5 p-3">
        <Input.Group isInvalid>
          <Input.Slot>
            <Text>123</Text>
          </Input.Slot>
          <Input />
          <Input.Slot>
            <Text>456</Text>
          </Input.Slot>
        </Input.Group>
      </View>
    </>
  );
}
