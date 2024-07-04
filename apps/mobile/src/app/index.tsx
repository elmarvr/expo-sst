import { Redirect, Stack } from 'expo-router';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      <Redirect href="sign-in" />
    </>
  );
}
