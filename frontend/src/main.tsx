import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

import './index.css';
import App from './App.tsx';

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    {/* </ClerkProvider> */}
  </StrictMode>
);
