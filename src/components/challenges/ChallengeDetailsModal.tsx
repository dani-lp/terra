import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { ChallengeDetailsModalSkeleton } from '@/components/challenges/ChallengeDetailsModalSkeleton';
import { ChallengeStats } from '@/components/challenges/ChallengeStats';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { Button, Modal } from '../common';

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
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const {
    data: challenge,
    isLoading,
    isError,
    error,
  } = trpc.challenges.get.useQuery({ id: challengeId });
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
            <>
              <h2 className="mb-2 text-3xl font-semibold">{challenge?.name}</h2>
              {/* TODO map paragraphs into <p> */}
              <p className="mb-2">{challenge?.description}</p>
              <ChallengeStats endDate={challenge?.endDate.toDateString() ?? ''} players={5297395} />
            </>
          )}
          <div className="mt-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            {/* TODO translate, use proper texts depending on user role, e.g. "edit" */}
            <Button className="w-full" variant="inverse" onClick={onExit}>
              {t('actions.close')}
            </Button>
            {isAlreadyEnrolled ? (
              <Link href={`/challenges/${challenge?.id ?? ''}`} className="w-full">
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
