import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query';
import {LiveAudioProvider} from './LiveAudioContext';

/**
 * @description
 * Global configuration options for react-query.
 * These options can also be overriden at the hook-call level.
 * @examples
 * https://react-query.tanstack.com/devtools
 */
const queryClient = new QueryClient();

export const AppProviders: React.FunctionComponent = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveAudioProvider>
        {children}
      </LiveAudioProvider>
    </QueryClientProvider>
  )
};