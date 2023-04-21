import { Skeleton } from '@/components/common/skeleton';
import { FlagIcon } from '@heroicons/react/20/solid';

export const PlayerDetailsSlideOverContentSkeleton = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
      <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
        <div className="flex">
          <Skeleton className="h-24 w-24" rounded />
        </div>
      </div>
      <div className="mt-4 divide-y divide-gray-200">
        <div>
          <div className="min-w-0 flex-1">
            <Skeleton className="h-7 w-52" />
          </div>

          <div className="mt-2">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="mt-2 mb-4 flex flex-col">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FlagIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </div>
        <Skeleton className="h-20" widthFull />
      </div>
    </div>
  );
};
