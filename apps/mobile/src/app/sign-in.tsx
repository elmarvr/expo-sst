import { Button } from '@acme/ui';
import { Stack, useRouter } from 'expo-router';

import { useAuth } from '~/lib/auth';

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Button
        onPress={async () => {
          await signIn();
          router.push('profile');
        }}>
        <Button.Text>Sign in</Button.Text>
      </Button>
    </>
  );
}
