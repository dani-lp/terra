import { ChallengeDetailsHeader } from '@/components/challenges/details';
import { Button } from '@/components/common';
import type { DisplayChallenge } from '@/types';
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

  if (!data) {
    // TODO error page
    return null;
  }

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  if (isLoading) {
    // TODO loading page
    return null;
  }

  const challenge: DisplayChallenge = {
    ...data.challenge,
    startDate: data.challenge.startDate.toLocaleDateString(),
    endDate: data.challenge.endDate.toLocaleDateString(),
    players: data.enrolledPlayerCount,
    status: new Date() < data.challenge.endDate ? 'open' : 'ended',
  };

  return (
    <div className="">
      <ChallengeDetailsHeader challenge={challenge} />

      <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 p-3 shadow lg:hidden">
        <Button className="w-full">
          Placeholder
        </Button>
      </div>
    </div>
  );
};
