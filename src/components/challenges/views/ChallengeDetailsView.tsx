import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import {
  ChallengeDetailsHeader,
  ChallengeDetailsHeaderSkeleton,
  ChallengeDetailsMobileContent,
  EditChallengeSlideOver,
  EnrollModal,
} from '@/components/challenges/details';
import { AddParticipationSlideOver } from '@/components/challenges/details/AddParticipationSlideOver';
import { ChallengeDetailsDesktopContent } from '@/components/challenges/details/ChallengeDetailsDesktopContent';
import { Button } from '@/components/common';
import { Skeleton } from '@/components/common/skeleton';
import { trpc } from '@/utils/trpc';
import Head from 'next/head';

type Props = {
  challengeId: string;
};

export const ChallengeDetailsView = ({ challengeId }: Props) => {
  const { data: session } = useSession();
  const { data, isLoading, isError, error } = trpc.challenges.get.useQuery({ id: challengeId });
  const [enrollModalOpen, setEnrollModalOpen] = React.useState(false);
  const [addParticipationSlideOverOpen, setAddParticipationSlideOverOpen] = React.useState(false);
  const [editChallengeSlideOverOpen, setEditChallengeSlideOverOpen] = React.useState(false);
  const { t } = useTranslation('challenges');
  const { t: tCommon } = useTranslation('common');

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
      setEditChallengeSlideOverOpen(true);
    } else if (data?.isPlayerEnrolled) {
      setAddParticipationSlideOverOpen(true);
    } else {
      setEnrollModalOpen(true);
    }
  };

  const isChallengeActive = data && new Date() < data.challenge.endDate;

  const userCanAct =
    (session?.user?.role === 'PLAYER' && isChallengeActive) ||
    (session?.user?.role === 'ORGANIZATION' && data?.userIsAuthor);

  const actionButtonText =
    session?.user?.role === 'ORGANIZATION'
      ? t('challenges.details.actionButton.edit')
      : data?.isPlayerEnrolled
      ? t('challenges.details.actionButton.addParticipation')
      : t('challenges.details.actionButton.join');

  return (
    <>
      {data ? (
        <Head>
          <title>{tCommon('titles.challengeDetailsName', { name: data.challenge.name })}</title>
        </Head>
      ) : (
        <Head>
          <title>{tCommon('titles.challengeDetails')}</title>
        </Head>
      )}
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
                challengeTags={data.challengeTags}
                enrolledPlayers={data.enrolledPlayerCount}
                authorName={data.organizationName ?? ''}
                withDescription
              />
            )}
            {userCanAct && (
              <div className="px-4">
                <Button
                  disabled={isLoading}
                  onClick={actionButtonOnClick}
                  className="hidden w-full md:block"
                >
                  {actionButtonText}
                </Button>
              </div>
            )}
            <div className="hidden px-4 py-3 md:block">
              {isLoading ? (
                <Skeleton className="h-48" />
              ) : (
                <p className="text-sm sm:text-base">{data?.challenge?.description ?? ''}</p>
              )}
            </div>
          </div>

          <ChallengeDetailsDesktopContent challengeId={challengeId} isLoading={isLoading} />
        </div>

        <ChallengeDetailsMobileContent challengeId={challengeId} loading={isLoading} />

        {userCanAct && (
          <div className="fixed bottom-0 flex h-16 w-screen items-center justify-between gap-2 border-t-2 border-neutral-200 p-3 shadow md:hidden">
            <Button disabled={isLoading} onClick={actionButtonOnClick} className="w-full">
              {actionButtonText}
            </Button>
          </div>
        )}
      </div>

      {!data?.isPlayerEnrolled && (
        <EnrollModal
          open={enrollModalOpen}
          setOpen={setEnrollModalOpen}
          challengeId={challengeId}
          challengeName={data?.challenge.name ?? ''}
        />
      )}
      {data?.isPlayerEnrolled && session?.user?.role === 'PLAYER' && (
        <AddParticipationSlideOver
          open={addParticipationSlideOverOpen}
          setOpen={setAddParticipationSlideOverOpen}
          challenge={data.challenge}
        />
      )}
      {data && session?.user?.role === 'ORGANIZATION' && (
        <EditChallengeSlideOver
          open={editChallengeSlideOverOpen}
          setOpen={setEditChallengeSlideOverOpen}
          challenge={data.challenge}
          challengeTags={data.challengeTags}
        />
      )}
    </>
  );
};
