import { LeaderBoardListRow } from '@/components/challenges/details/LeaderBoardListRow';
import { LeaderBoardListRowSkeleton } from '@/components/challenges/details/LeaderBoardListRowSkeleton';
import { classNames } from '@/const';
import { useSession } from 'next-auth/react';

type Props = {
  loading: boolean;
  className?: string;
};

export const LeaderBoardList = ({ loading, className }: Props) => {
  const { data: session } = useSession();

  // TODO use actual values/query
  const tempLeaderboardContent = [
    { name: 'John Smith', username: 'jsmith', score: 75, image: session?.user?.image },
    { name: 'Emily Davis', username: 'edavis', score: 92, image: session?.user?.image },
    { name: 'Tom Johnson', username: 'tjohnson', score: 81, image: session?.user?.image },
    { name: 'Sarah Lee', username: 'slee', score: 67, image: session?.user?.image },
  ];
  tempLeaderboardContent.sort((a, b) => b.score - a.score);

  
  return (
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
            />
          ))}
        </>
      )}
    </ol>
  );
};
