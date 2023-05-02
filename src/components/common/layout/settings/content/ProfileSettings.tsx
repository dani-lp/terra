import { useSession } from 'next-auth/react';

import { OrgProfileSettings } from './OrgProfileSettings';
import { PlayerProfileSettings } from './PlayerProfileSettings';

type Props = {
  handleClose: () => void;
};

export const ProfileSettings = ({ handleClose }: Props) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div></div>;
  }

  if (session.user.role === 'ORGANIZATION') {
    return <OrgProfileSettings handleClose={handleClose} />;
  }

  if (session.user.role === 'PLAYER') {
    return <PlayerProfileSettings handleClose={handleClose} />;
  }

  return null;
};
