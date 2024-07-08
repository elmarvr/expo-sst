import { Button } from '@acme/ui';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '~/lib/auth';

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <SafeAreaView>
      <Button
        onPress={async () => {
          await signIn({ redirectTo: 'rooms' });
        }}>
        <Button.Text>Sign in</Button.Text>
      </Button>
    </SafeAreaView>
  );
}
