import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import {
  ChallengeDetailsHeader,
  ChallengeDetailsHeaderSkeleton,
  ChallengeDetailsMobileContent,
  EnrollModal,
  LeaderBoardList,
} from '@/components/challenges/details';
import { Button } from '@/components/common';
import { Skeleton } from '@/components/common/skeleton';
import { trpc } from '@/utils/trpc';

type Props = {
  challengeId: string;
};

export const ChallengeDetailsView = ({ challengeId }: Props) => {
  const { data: session } = useSession();
  const { data, isLoading, isError, error } = trpc.challenges.get.useQuery({ id: challengeId });
  const [enrollModalOpen, setEnrollModalOpen] = React.useState(false);
  const { t } = useTranslation('challenges');

  if (!challengeId) {
    // TODO error page
    return null;
  }

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  const actionButtonOnClick = async () => {
    if (session?.user?.role === 'ORGANIZATION') {
      // TODO edition modal
    } else if (data?.isPlayerEnrolled) {
      // TODO participation modal
    } else {
      setEnrollModalOpen(true);
    }
  };

  const actionButtonText =
    session?.user?.role === 'ORGANIZATION'
      ? t('challenges.details.actionButton.edit')
      : data?.isPlayerEnrolled
      ? t('challenges.details.actionButton.addParticipation')
      : t('challenges.details.actionButton.join');

  return (
    <>
      <div className="overflow-hidden">
        <div className="md:grid md:grid-cols-2 md:gap-4 md:p-4 lg:gap-8">
          <div className="flex flex-col gap-2 md:col-span-1 md:max-w-md">
            {isLoading && (
              <>
                <ChallengeDetailsHeaderSkeleton />
              </>
            )}
            {!isLoading && data !== null && (
              <ChallengeDetailsHeader
                challenge={data.challenge}
                enrolledPlayers={data?.enrolledPlayerCount}
              />
            )}
            <div className="px-4">
              <Button disabled={isLoading} onClick={actionButtonOnClick} className="hidden w-full md:block">
                {actionButtonText}
              </Button>
            </div>
            <div className="hidden px-4 py-3 md:block">
              {isLoading ? (
                <Skeleton className="h-48" />
              ) : (
                <p className="text-sm sm:text-base">{data?.challenge?.description ?? ''}</p>
              )}
            </div>
          </div>

          <div className="hidden rounded-lg bg-white px-4 py-6 shadow md:col-span-1 md:block">
            {/* TODO i18n */}
            <h3 className="mb-2 ml-3 text-lg font-semibold leading-5 text-gray-900">Leaderboard</h3>
            <LeaderBoardList loading={isLoading} />
          </div>
        </div>

        <ChallengeDetailsMobileContent challenge={data?.challenge} loading={isLoading} />

        <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 p-3 shadow md:hidden">
          <Button disabled={isLoading} onClick={actionButtonOnClick} className="w-full">
            {actionButtonText}
          </Button>
        </div>
      </div>

      <EnrollModal
        open={enrollModalOpen}
        setOpen={setEnrollModalOpen}
        challengeId={challengeId}
        challengeName={data?.challenge.name ?? ''}
      />
    </>
  );
};
