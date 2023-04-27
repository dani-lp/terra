import * as React from 'react';

import { LeaderBoardListRow } from '@/components/challenges/details/LeaderBoardListRow';
import { LeaderBoardListRowSkeleton } from '@/components/challenges/details/LeaderBoardListRowSkeleton';
import { PlayerDetailsSlideOver } from '@/components/users';
import { classNames } from '@/const';
import { trpc } from '@/utils/trpc';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';

type Props = {
  loading: boolean;
  challengeId: string;
  className?: string;
};

export const LeaderBoardList = ({
  loading: challengeInfoLoading,
  challengeId,
  className,
}: Props) => {
  const { t } = useTranslation('challenges');
  const { data, isLoading, isError, error } = trpc.participation.getByChallenge.useQuery({
    challengeId,
  });
  const [overviewPlayerId, setOverviewPlayerId] = React.useState<string | null>(null);

  const leaderboardEntries = data ?? [];
  const loading = isLoading || challengeInfoLoading;

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  return (
    <>
      <ol className={classNames('flex flex-col gap-1', className)}>
        {loading && (
          <>
            {[...Array(4)].map((_, index) => (
              <LeaderBoardListRowSkeleton key={index} position={index + 1} />
            ))}
          </>
        )}
        {!loading &&
          leaderboardEntries.length > 0 &&
          leaderboardEntries.map((user, index) => (
            <LeaderBoardListRow
              key={user.username}
              position={index + 1}
              image={user.image ?? ''}
              name={user.name ?? 'Unknown'}
              username={user.username ?? '@unknown'}
              score={user.points}
              onClick={() => setOverviewPlayerId(user.playerId)}
            />
          ))}
        {!loading && leaderboardEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-10 text-center">
            <div className="mx-auto rounded-full bg-purple-100 p-2">
              <UserGroupIcon className="mx-auto h-8 w-8 text-purple-700" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{t('challenges.details.noPlayers')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('challenges.details.noPlayersDescription')}</p>
          </div>
        )}
      </ol>
      <PlayerDetailsSlideOver
        open={overviewPlayerId !== null}
        setOpen={() => setOverviewPlayerId(null)}
        playerId={overviewPlayerId}
      />
    </>
  );
};
