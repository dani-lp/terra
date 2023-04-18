import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid';

import { Skeleton } from '@/components/common/skeleton';

export const ChallengeDetailsHeaderSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start bg-white px-4 py-3 shadow md:bg-transparent md:shadow-none">
      <div className="mb-1">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="mb-1">
        <Skeleton className="h-5 w-36" />
      </div>

      <div className="mt-2 mb-4 flex flex-col md:mt-5">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <UsersIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="mb-2">
        <Skeleton className="h-5 w-20" />
      </div>
      
      <div className="mb-3 flex flex-wrap gap-2">
        <Skeleton className="h-4 w-16" rounded />
        <Skeleton className="h-4 w-28" rounded />
        <Skeleton className="h-4 w-12" rounded />
      </div>
    </div>
  );
};
