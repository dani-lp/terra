import * as React from 'react';

import { LeaderBoardListRow } from '@/components/challenges/details/LeaderBoardListRow';
import { LeaderBoardListRowSkeleton } from '@/components/challenges/details/LeaderBoardListRowSkeleton';
import { PlayerDetailsSlideOver } from '@/components/users';
import { classNames } from '@/const';
import { trpc } from '@/utils/trpc';

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
        {loading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <LeaderBoardListRowSkeleton key={index} position={index + 1} />
            ))}
          </>
        ) : (
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
          ))
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
