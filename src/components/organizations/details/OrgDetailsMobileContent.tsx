import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { ChallengeListRow } from '@/components/challenges';
import { ChallengeRowSkeleton } from '@/components/challenges/ChallengeRowSkeleton';
import { Button } from '@/components/common';
import { trpc } from '@/utils/trpc';

const NoChallengesState = () => {
  const { t } = useTranslation('orgs');

  return (
    <div className="py-8 px-4 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {t('details.noChallenges.title')}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{t('details.noChallenges.message')}</p>
      <div className="mt-6">
        <Link href="/organizations" className="flex justify-center">
          <Button>
            <span className="mr-2" aria-hidden="true">
              &larr;
            </span>
            {t('details.noChallenges.button')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

type Props = {
  orgDetailsId: string;
};

export const OrgDetailsMobileContent = ({ orgDetailsId }: Props) => {
  const { data, isLoading, isError, error } = trpc.challenges.createdByOrganization.useQuery({
    orgDetailsId,
  });

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  const challenges = data ?? [];

  if (data && challenges.length === 0) {
    return <NoChallengesState />;
  }

  return (
    <ul
      role="list"
      className="m-2 divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow"
    >
      {isLoading && [...Array(3)].map((_, i) => <ChallengeRowSkeleton key={i} />)}
      {!isLoading &&
        challenges.map((challenge) => (
          <ChallengeListRow key={challenge.id} challenge={challenge} asLink />
        ))}
    </ul>
  );
};
