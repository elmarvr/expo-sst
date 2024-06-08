import AsyncStorage from '@react-native-async-storage/async-storage';
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';
import { ZodRawShape, z } from 'zod';
import 'react-native-get-random-values';

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) {
      return encryptionKeyHex;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1)
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) {
      return encrypted;
    }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    await AsyncStorage.setItem(key, encrypted);
  }
}

export function createStorage<TSchema extends ZodRawShape>(
  name: string,
  opts: {
    schema: TSchema;
    adapter: {
      getItem(key: string): Promise<string | null>;
      setItem(key: string, value: string): Promise<void>;
      removeItem(key: string): Promise<void>;
    };
  }
) {
  const { schema, adapter } = opts;

  function getKey(key: string) {
    return `${name}_${key}`;
  }

  return {
    async getItem<TKey extends keyof TSchema & string>(
      key: TKey
    ): Promise<TSchema[TKey]['_output'] | null> {
      const value = await adapter.getItem(getKey(key));
      if (!value) {
        return null;
      }

      return schema[key].parse(JSON.parse(value));
    },
    async setItem<TKey extends keyof TSchema & string>(
      key: TKey,
      value: TSchema[TKey]['_input']
    ): Promise<void> {
      const parsed = schema[key].parse(value);
      await adapter.setItem(getKey(key), JSON.stringify(parsed));
    },

    async removeItem(key: keyof TSchema & string): Promise<void> {
      await adapter.removeItem(getKey(key));
    },
  };
}

export const authStore = createStorage('Auth', {
  schema: {
    sessionToken: z.string(),
  },
  adapter: new LargeSecureStore(),
});

export const appStore = createStorage('App', {
  schema: {
    theme: z.enum(['light', 'dark']),
  },
  adapter: AsyncStorage,
});
