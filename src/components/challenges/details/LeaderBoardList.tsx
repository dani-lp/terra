import { useSession } from 'next-auth/react';
import * as React from 'react';

import { LeaderBoardListRow } from '@/components/challenges/details/LeaderBoardListRow';
import { LeaderBoardListRowSkeleton } from '@/components/challenges/details/LeaderBoardListRowSkeleton';
import { PlayerDetailsSlideOver } from '@/components/users';
import { classNames } from '@/const';

type Props = {
  loading: boolean;
  className?: string;
};

export const LeaderBoardList = ({ loading, className }: Props) => {
  const { data: session } = useSession();
  const [overviewPlayerId, setOverviewPlayerId] = React.useState<string | null>(null);

  // TODO use actual values/query
  const tempLeaderboardContent = [
    {
      name: 'John Smith',
      username: 'jsmith',
      score: 75,
      image: session?.user?.image,
      tempId: 'clc9t4kud0005debqizdl66u9',
    },
    {
      name: 'Emily Davis',
      username: 'edavis',
      score: 92,
      image: session?.user?.image,
      tempId: 'clc9t4kud0005debqizdl66u9',
    },
    {
      name: 'Tom Johnson',
      username: 'tjohnson',
      score: 81,
      image: session?.user?.image,
      tempId: 'clc9t4kud0005debqizdl66u9',
    },
    {
      name: 'Sarah Lee',
      username: 'slee',
      score: 67,
      image: session?.user?.image,
      tempId: 'clc9t4kud0005debqizdl66u9',
    },
  ];
  tempLeaderboardContent.sort((a, b) => b.score - a.score);

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
          <>
            {tempLeaderboardContent.map((user, index) => (
              <LeaderBoardListRow
                key={user.username}
                position={index + 1}
                image={user.image ?? ''}
                name={user.name}
                username={user.username}
                score={user.score}
                onClick={() => setOverviewPlayerId(user.tempId)} // TODO use actual id
              />
            ))}
          </>
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
