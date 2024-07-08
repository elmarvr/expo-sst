import '../global.css';

import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TRPCProvider } from '../lib/api';

export default function Layout() {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </TRPCProvider>
  );
}
