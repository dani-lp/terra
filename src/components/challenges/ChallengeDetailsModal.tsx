import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { ChallengeDetailsModalSkeleton } from '@/components/challenges/ChallengeDetailsModalSkeleton';
import { ChallengeStats } from '@/components/challenges/ChallengeStats';
import { classNames, difficultyIconColors, tagColors } from '@/const';
import { trpc } from '@/utils/trpc';
import { StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { Button, Chip, Modal } from '../common';

type Props = {
  challengeId: string;
  onExit: () => void;
  isAlreadyEnrolled?: boolean;
};

export const ChallengeDetailsModal = ({
  challengeId,
  onExit,
  isAlreadyEnrolled = false,
}: Props) => {
  const { t } = useTranslation();
  const { t: tChallenges } = useTranslation('challenges');
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const { data, isLoading, isError, error } = trpc.challenges.get.useQuery({ id: challengeId });
  const challengeEnrollment = trpc.challenges.enroll.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.challenges.available.invalidate(),
        utils.challenges.enrolled.invalidate(),
      ]);
      onExit();
    },
  });
  const router = useRouter();

  const handleAccept = async () => {
    if (!challengeId) return;
    if (session?.user?.role === 'PLAYER') {
      challengeEnrollment.mutate({ challengeId });
    } else if (session?.user?.role === 'ORGANIZATION') {
      await router.push(`/challenges/${challengeId}`);
    }
  };

  const acceptText =
    session?.user?.role === 'PLAYER' ? t('actions.join') : t('actions.viewDetails');

  if (isError) {
    console.error(error);
    return null;
  }

  const tags =
    data?.challengeTags.map((tag) => ({
      name: tChallenges(`challenges.tags.${tag}`),
      color: tagColors[tag],
    })) || [];

  const status = new Date() < (data?.challenge?.endDate ?? new Date()) ? 'open' : 'ended';

  return (
    <Modal open={!!challengeId} setOpen={onExit} fullScreen className="max-w-3xl sm:max-h-[500px]">
      <div className="flex h-full flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-[300px] w-[500px] overflow-hidden rounded-lg object-cover sm:h-[500px] sm:rounded-none sm:p-0">
          <Image
            src="/img/beach-cleaning-example.jpg"
            alt="Beach cleaning"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start px-4 py-2 sm:py-6">
          {isLoading ? (
            <ChallengeDetailsModalSkeleton />
          ) : (
            <div className="w-full divide-y divide-gray-200">
              <div>
                <h2 className="mb-2 text-3xl font-semibold">{data?.challenge?.name}</h2>
                {tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Chip key={tag.name} label={tag.name} className={tag.color} />
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <dl className="mt-2 flex flex-wrap gap-4 capitalize">
                  <dt className="sr-only">{tChallenges('challenges.creation.difficulty')}</dt>
                  <dd className="flex items-center text-sm font-medium text-gray-500">
                    <StarIcon
                      className={classNames(
                        'mr-1 h-5 w-5 shrink-0',
                        difficultyIconColors[data?.challenge.difficulty ?? 'EASY'],
                      )}
                      aria-hidden="true"
                    />
                    {tChallenges(
                      `challenges.creation.difficulties.${
                        data?.challenge.difficulty.toLowerCase() ?? 'easy'
                      }`,
                    )}
                  </dd>
                  <dt className="sr-only">{t('a11y.status')}</dt>
                  <dd className="-mt-0.5">
                    <Chip
                      label={
                        status === 'open'
                          ? tChallenges('challenges.details.header.open')
                          : tChallenges('challenges.details.header.closed')
                      }
                      className={
                        status === 'open'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }
                    />
                  </dd>
                </dl>
                <ChallengeStats
                  endDate={data?.challenge?.endDate.toISOString().substring(0, 10) ?? ''}
                  players={data?.enrolledPlayerCount ?? 0}
                  location={data?.challenge?.location ?? ''}
                />
              </div>
              <p className="pt-2">{data?.challenge?.description}</p>
            </div>
          )}

          <div className="mt-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button className="w-full" variant="inverse" onClick={onExit}>
              {t('actions.close')}
            </Button>
            {isAlreadyEnrolled || session?.user?.role === 'ORGANIZATION' ? (
              <Link href={`/challenges/${data?.challenge?.id ?? ''}`} className="w-full">
                <Button
                  disabled={!challengeId || challengeEnrollment.isLoading || isError || isLoading}
                  className="w-full"
                >
                  {t('actions.seeDetails')}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleAccept}
                disabled={!challengeId || challengeEnrollment.isLoading || isError || isLoading}
                className="w-full"
              >
                {acceptText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
