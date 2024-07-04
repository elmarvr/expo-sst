import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Create() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Rooms' }} />
    </View>
  );
}
