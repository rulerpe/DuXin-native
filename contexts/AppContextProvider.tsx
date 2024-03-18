import { ReactNode } from 'react';

import { PhotoProvider } from './PhotoContext';
import { UserProvider } from './UserContext';

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <PhotoProvider>{children}</PhotoProvider>
    </UserProvider>
  );
};
