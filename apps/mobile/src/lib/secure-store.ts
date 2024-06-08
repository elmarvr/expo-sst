import AsyncStorage from '@react-native-async-storage/async-storage';
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { ZodRawShape, z } from 'zod';

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore<TShape extends ZodRawShape> {
  constructor(private shape: TShape) {}

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

  async getItem<TKey extends keyof TShape & string>(
    key: TKey
  ): Promise<TShape[TKey]['_output'] | null> {
    const encrypted = await AsyncStorage.getItem(key);

    if (!encrypted) {
      return null;
    }

    const item = await this._decrypt(key, encrypted);

    return this.shape[key].parse(item);
  }

  async removeItem(key: keyof TShape & string): Promise<void> {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem<TKey extends keyof TShape & string>(
    key: TKey,
    value: TShape[TKey]['_input']
  ): Promise<void> {
    const parsed = this.shape[key].parse(value);
    const encrypted = await this._encrypt(key, parsed);

    await AsyncStorage.setItem(key, encrypted);
  }
}

export const secureStore = new LargeSecureStore({
  'auth-session-token': z.string(),
});
