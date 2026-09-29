import * as SecureStore from 'expo-secure-store';

const KEY = 'keepay.accessToken';
let memory: string | null = null;

/** Access token lưu trong Keychain/Keystore (SecureStore), có cache trong RAM. */
export const tokenStorage = {
  async get(): Promise<string | null> {
    if (!memory) memory = await SecureStore.getItemAsync(KEY);
    return memory;
  },
  async set(token: string): Promise<void> {
    memory = token;
    await SecureStore.setItemAsync(KEY, token);
  },
  async clear(): Promise<void> {
    memory = null;
    await SecureStore.deleteItemAsync(KEY);
  },
};
