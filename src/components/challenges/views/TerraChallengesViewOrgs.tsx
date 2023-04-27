import { useTranslation } from 'next-i18next';
import * as React from 'react';

import {
  ChallengeDetailsModal,
  ChallengeListRow,
  ChallengeRowSkeleton,
  ChallengesFilterGroup,
  ChallengesViewTopBar,
  NewChallengeSlideOver,
  SmallFilterGroup,
} from '@/components/challenges';
import { useChallenges } from '@/components/challenges/hooks/useChallenges';
import { trpc } from '@/utils/trpc';

export const TerraChallengesViewOrgs = () => {
  const { t } = useTranslation('challenges');
  const { filteredChallenges, isLoading, isError, error } = useChallenges(trpc.challenges.created);
  const [modalChallengeId, setModalChallengeId] = React.useState<string>('');

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const showEmptyState = !isLoading && !isError && filteredChallenges.length === 0;

  return (
    <>
      <ChallengesViewTopBar showNewChallengeButton className="py-2 px-4" />

      {/* Main content */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="lg:grid lg:grid-cols-7 lg:gap-4">
            <div className="min-w-[250px] lg:col-span-2 xl:px-0">
              <div className="mt-2 mb-3 flex flex-row items-center justify-between gap-2 lg:hidden xl:flex-col xl:items-start">
                <h1 className="text-2xl font-bold">Your challenges</h1>
                <NewChallengeSlideOver />
              </div>
              <div className="mb-2 flex flex-col items-center justify-between lg:hidden">
                <SmallFilterGroup />
              </div>
              <div className="hidden lg:block">
                <ChallengesFilterGroup showTitle />
              </div>
            </div>
            {!showEmptyState && (
              <div className="mb-2 w-full lg:col-span-5">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow"
                >
                  {isLoading && [...Array(3)].map((_, i) => <ChallengeRowSkeleton key={i} />)}
                  {!isLoading &&
                    !isError &&
                    filteredChallenges.map((challenge) => (
                      <ChallengeListRow
                        key={challenge.id}
                        challenge={challenge}
                        onClick={() => setModalChallengeId(challenge.id)}
                      />
                    ))}
                </ul>
              </div>
            )}
            {showEmptyState && (
              <div className="flex h-96 w-full flex-col items-center justify-center lg:col-span-5">
                <p className="text-center text-neutral-500">
                  {t('challenges.overview.noChallengesFound')}
                </p>
              </div>
            )}
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
