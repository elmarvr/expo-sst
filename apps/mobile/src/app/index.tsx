import { Stack, Link } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { api } from '../lib/api';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

export default function Home() {
  const [title, setTitle] = useState('');

  const { data: todos } = api.todo.list.useQuery(undefined, {
    initialData: [],
  });

  const utils = api.useUtils();

  const { mutate: createTodo } = api.todo.create.useMutation({
    onSuccess() {
      utils.todo.list.invalidate();
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <View>
          <TextInput placeholder="Add a todo" value={title} onChangeText={setTitle} />
          <Button
            title="Add"
            onPress={() => {
              createTodo({
                title,
              });
            }}
          />
        </View>

        {todos.map((todo) => (
          <Text key={todo.id}>{todo.title}</Text>
        ))}

        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title="Show Details" />
        </Link>
      </Container>
    </>
  );
}
