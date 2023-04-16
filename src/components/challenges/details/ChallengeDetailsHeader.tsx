import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import { Chip } from '@/components/common';
import type { DisplayChallenge } from '@/types';

type Props = {
  challenge: DisplayChallenge;
};

export const ChallengeDetailsHeader = ({ challenge }: Props) => {
  const tempTags = [
    { name: 'Recycling', color: 'bg-green-100 text-green-800' },
    { name: 'Sustainability', color: 'bg-blue-100 text-blue-800' },
    { name: 'Other', color: 'bg-violet-100 text-violet-800' },
  ];

  return (
    <div className="flex w-full flex-col items-start justify-start bg-white px-4 py-3 shadow">
      <h2 className="mb-1 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {challenge.name}
      </h2>
      {/* TODO remove placeholder */}
      <p className="text-sm font-medium text-gray-500">
        By{' '}
        <Link href="#" className="text-gray-800 underline">
          University of Deusto
        </Link>
      </p>

      <div className="mt-2 mb-4 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          {challenge.startDate} &ndash; {challenge.endDate}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <UsersIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          $120k &ndash; $140k
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          {/* TODO remove placeholder */}
          Anywhere
        </div>
      </div>

      <h3 className="mb-1 text-base font-semibold leading-6 text-gray-900">Tags</h3>
      <div className="mb-2 flex flex-wrap gap-2">
        {tempTags.map((tag) => (
          <Chip key={tag.name} label={tag.name} className={tag.color} />
        ))}
      </div>
    </div>
  );
};
