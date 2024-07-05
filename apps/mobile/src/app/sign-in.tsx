import { Button } from '@acme/ui';
import { Stack } from 'expo-router';

import { useAuth } from '~/lib/auth';

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Button
        onPress={async () => {
          await signIn({ redirectTo: 'rooms' });
        }}>
        <Button.Text>Sign in</Button.Text>
      </Button>
    </>
  );
}
