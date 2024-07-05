import {
  AccessTokenRequestConfig,
  ResponseType,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { ExpoRouter } from 'expo-router/types/expo-router';
import { useEffect, useRef } from 'react';

import { api } from './api';
import { authStore } from './storage';

const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_URL}/oauth2/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_URL}/oauth2/token`,
  revocationEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_USER_POOL_URL}/oauth2/revoke`,
};

const clientId = process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID!;
const redirectUri = makeRedirectUri({});

export function useAuth() {
  const router = useRouter();
  const utils = api.useUtils();
  const signInRedirect = useRef<ExpoRouter.Href | null>(null);

  const { mutateAsync: signInWithIdToken } = api.auth.signInWithIdToken.useMutation({
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();
    },
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response) {
      if (response.type === 'error') {
        // Alert.alert(
        //   'Authentication error',
        //   response.params.error_description || 'something went wrong'
        // );
        return;
      }

      if (response.type === 'success') {
        exchangeCode({
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

  async function exchangeCode(config: AccessTokenRequestConfig) {
    try {
      const response = await exchangeCodeAsync(config, discovery);

      const { sessionToken } = await signInWithIdToken({
        idToken: response.idToken!,
      });

      await authStore.setItem('sessionToken', sessionToken);

      router.push(signInRedirect.current ?? 'profile');
    } catch (error) {
      console.error(error);
    }
  }

  return {
    signIn: async (opts?: { redirectTo?: ExpoRouter.Href }) => {
      signInRedirect.current = opts?.redirectTo ?? null;

      await promptAsync();
    },
  };
}
