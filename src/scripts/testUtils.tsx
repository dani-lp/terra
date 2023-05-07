import * as React from 'react';

import { render, type RenderOptions } from '@testing-library/react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

const BaseProviders = ({ children }: { children: React.ReactNode }) => {
  const mockSession: Session = {
    expires: '1',
    user: {
      id: '1',
      role: 'PLAYER',
      email: 'mail@mail.com',
      name: 'John Doe',
      image: 'c',
    },
  };

  return <SessionProvider session={mockSession}>{children}</SessionProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: BaseProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
