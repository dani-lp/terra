import { CalendarIcon, UserGroupIcon } from '@heroicons/react/20/solid';

import { Skeleton } from '@/components/common/skeleton';

export const ChallengeDetailsModalSkeleton = () => {
  return (
    <>
      <div className="mb-2">
        <Skeleton className="h-9 w-72" />
      </div>
      <div className="mb-2 w-full">
        <Skeleton className="h-52" widthFull />
      </div>
      <div className="mt-2 sm:justify-between">
        <div className="mb-2 sm:flex">
          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
            <Skeleton className="h-4 w-40" />
          </div>
          {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      {position.location}
                    </p> */}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0">
          <CalendarIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </>
  );
};
