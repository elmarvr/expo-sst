import '../global.css';

import { Stack } from 'expo-router';

import { TRPCProvider } from '../lib/api';

export default function Layout() {
  return (
    <TRPCProvider>
      <Stack />
    </TRPCProvider>
  );
}
