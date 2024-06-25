import { Button, Form, FormControl, Input, useForm } from '@acme/ui';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { z } from 'zod';

export default function Home() {
  const form = useForm({
    schema: z.object({
      email: z.string().email(),
    }),
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      <View className="p-3">
        <Form onSubmit={onSubmit}>
          <Form.Field control={form.control} name="email">
            {({ field }) => (
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input value={field.value} onChangeText={field.onChange} />
                <FormControl.Error />
              </FormControl>
            )}
          </Form.Field>

          <Form.Trigger asChild>
            <Button>
              <Button.Text>Test</Button.Text>
            </Button>
          </Form.Trigger>
        </Form>
      </View>
    </>
  );
}
