import { useSession } from 'next-auth/react';

import { OrgProfileSettings } from './OrfProfileSettings';
import { PlayerProfileSettings } from './PlayerProfileSettings';

export const ProfileSettings = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div></div>;
  }

  if (session.user.role === 'ORGANIZATION') {
    return <OrgProfileSettings />;
  }

  if (session.user.role === 'PLAYER') {
    return <PlayerProfileSettings />;
  }

  return null;
};
