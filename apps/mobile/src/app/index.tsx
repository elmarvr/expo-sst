import {
  AccessTokenRequestConfig,
  ResponseType,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { api } from '~/lib/api';

const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_URL}/oauth2/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_URL}/oauth2/token`,
  revocationEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_URL}/oauth2/revoke`,
};

const clientId = process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID!;
const redirectUri = makeRedirectUri({});

export default function Home() {
  const { mutateAsync: signInWithIdToken } = api.auth.signInWithIdToken.useMutation();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  React.useEffect(() => {
    const exchangeFn = async (exchangeTokenReq: AccessTokenRequestConfig) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(exchangeTokenReq, discovery);

        const response = await signInWithIdToken({
          idToken: exchangeTokenResponse.idToken!,
        });

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    if (response) {
      if (response.type === 'error') {
        // Alert.alert(
        //   'Authentication error',
        //   response.params.error_description || 'something went wrong'
        // );
        return;
      }

      if (response.type === 'success') {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier!,
          },
        });
      }
    }
  }, [discovery, request, response]);

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View>
        <Button title="Sign In" onPress={() => promptAsync()} />
      </View>
    </>
  );
}
