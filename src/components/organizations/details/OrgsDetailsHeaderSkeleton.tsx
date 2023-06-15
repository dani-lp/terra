import { Skeleton } from '@/components/common';
import { LinkIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid';

const HeaderTitleSkeleton = () => {
  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex items-start space-x-5">
        <div className="shrink-0">
          <div className="relative">
            <Skeleton className="h-16 w-16" rounded />
            <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
        </div>
        <div className="pt-1.5">
          <Skeleton className="h-6 w-56" />
          <div className="pt-2">
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrgsDetailsHeaderSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start bg-white px-4 py-3 shadow md:bg-transparent">
      <HeaderTitleSkeleton />

      <div className="mt-2 mb-4 flex flex-col md:mt-5">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <LinkIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <UsersIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <Skeleton className="h-20" widthFull />
    </div>
  );
};
