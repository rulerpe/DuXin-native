import { ReactNode } from 'react';

import { LoginProvider } from './LoginContext';
import { PhotoProvider } from './PhotoContext';
import { UserProvider } from './UserContext';

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <LoginProvider>
        <PhotoProvider>{children}</PhotoProvider>
      </LoginProvider>
    </UserProvider>
  );
};
