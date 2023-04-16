import {
  ChallengeDetailsHeader,
  ChallengeDetailsHeaderSkeleton,
  ChallengeDetailsMobileContent,
} from '@/components/challenges/details';
import { Button } from '@/components/common';
import { trpc } from '@/utils/trpc';

type Props = {
  challengeId: string;
};

export const ChallengeDetailsView = ({ challengeId }: Props) => {
  const { data, isLoading, isError, error } = trpc.challenges.get.useQuery({ id: challengeId });

  if (!challengeId) {
    // TODO error page
    return null;
  }

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  return (
    <div>
      {isLoading && (
        <>
          <ChallengeDetailsHeaderSkeleton />
        </>
      )}
      {(!isLoading && data !== null) && (
        <ChallengeDetailsHeader
          challenge={data.challenge}
          enrolledPlayers={data?.enrolledPlayerCount}
        />
      )}
      <ChallengeDetailsMobileContent challenge={data?.challenge} loading={isLoading} />

      <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 p-3 shadow lg:hidden">
        <Button className="w-full">Placeholder</Button>
      </div>
    </div>
  );
};
