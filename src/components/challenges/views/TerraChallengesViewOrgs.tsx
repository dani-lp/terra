import {
  ChallengeListEntry,
  ChallengesFilterGroup,
  NewChallengeSlideOver,
} from '@/components/challenges';
import { ChallengeDetailsModal } from '@/components/challenges/ChallengeDetailsModal';
import { ChallengeRowSkeleton } from '@/components/challenges/ChallengeRowSkeleton';
import { ChallengesViewTopBar } from '@/components/challenges/ChallengesViewTopBar';
import { useChallenges } from '@/components/challenges/hooks/useChallenges';
import { SmallFilterGroup } from '@/components/challenges/SmallFilterGroup';
import { trpc } from '@/utils/trpc';
import * as React from 'react';

export const TerraChallengesViewOrgs = () => {
  const { filteredChallenges, isLoading, isError, error } = useChallenges(trpc.challenges.created);
  const [modalChallengeId, setModalChallengeId] = React.useState<string>('');

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return (
    <>
      <ChallengesViewTopBar showNewChallengeButton className="py-2 px-4" />

      {/* Main content */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col xl:flex-row xl:gap-4">
            <div className="min-w-[250px] xl:px-0">
              <div className="mt-2 mb-3 flex flex-row items-center justify-between gap-2 xl:hidden xl:flex-col xl:items-start">
                <h1 className="text-2xl font-bold">Your challenges</h1>
                <NewChallengeSlideOver />
              </div>
              <div className="mb-2 flex flex-col items-center justify-between xl:hidden">
                <SmallFilterGroup />
              </div>
              <div className="hidden xl:block">
                <ChallengesFilterGroup showTitle />
              </div>
            </div>
            <div className="w-full">
              <ul
                role="list"
                className="divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow"
              >
                {isLoading && [...Array(3)].map((_, i) => <ChallengeRowSkeleton key={i} />)}
                {!isLoading &&
                  !isError &&
                  filteredChallenges.map((challenge) => (
                    <ChallengeListEntry
                      key={challenge.id}
                      challenge={challenge}
                      onClick={() => setModalChallengeId(challenge.id)}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ChallengeDetailsModal
        challengeId={modalChallengeId}
        onExit={() => setModalChallengeId('')}
      />
    </>
  );
};
