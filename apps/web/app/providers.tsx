'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'font-body text-sm',
            duration: 3000,
            style: {
              border: '3px solid #2D2D2D',
              borderRadius: '16px',
              padding: '12px 20px',
              background: '#FCF9F2',
              color: '#2D2D2D',
              boxShadow: '3px 4px 0px #2D2D2D',
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
