import * as React from 'react';

import { Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';

import { settingsModalOpenAtom } from '@/components/common/layout/utils/atoms';
import { Skeleton } from '@/components/common';
import { PlayerDetailsSlideOver } from '@/components/users';
import { classNames } from '@/const';
import { trpc } from '@/utils/trpc';
import { useTranslation } from 'next-i18next';

type Props = {
  hideUser?: boolean;
  hideSettings?: boolean;
  className?: string;
};

export const NavigationButtons = ({ hideUser, hideSettings, className }: Props) => {
  const { t } = useTranslation('common');
  const [playerDetailsOpen, setPlayerDetailsOpen] = React.useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useAtom(settingsModalOpenAtom);
  const { data: session, status } = useSession();
  const {
    data,
    isLoading: playerDataLoading,
    isError,
    error,
  } = trpc.user.getPlayerDataId.useQuery({ userId: session?.user?.id ?? '' });

  const isLoading = status === 'loading';
  const isPlayerDataLoading = playerDataLoading || isLoading;

  if (isError) {
    console.error(error);
  }

  const playerDataId = data ?? '';

  return (
    <>
      <div className={classNames('items-center justify-center gap-2 p-2', className)}>
        {session?.user?.role === 'PLAYER' && !isError && playerDataId !== '' && !hideUser && (
          <button
            className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-black hover:text-white"
            onClick={() => setPlayerDetailsOpen(true)}
            aria-label={t('a11y.profile') ?? 'profile'}
          >
            {isPlayerDataLoading && <Skeleton className="h-6 w-6" />}
            {!isPlayerDataLoading && <UserIcon className="w-6" />}
          </button>
        )}
        {!hideSettings && (
          <button
            onClick={() => setSettingsModalOpen(!settingsModalOpen)}
            className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-black hover:text-white"
            aria-label={t('a11y.settings') ?? 'settings'}
          >
            {isLoading && <Skeleton className="h-6 w-6" />}
            {!isLoading && <Cog6ToothIcon className="w-6" />}
          </button>
        )}
      </div>
      <PlayerDetailsSlideOver
        playerId={playerDataId}
        open={playerDetailsOpen}
        setOpen={setPlayerDetailsOpen}
      />
    </>
  );
};
