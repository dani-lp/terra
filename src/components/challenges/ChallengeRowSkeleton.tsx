import { Skeleton } from '@/components/common/skeleton';

export const ChallengeRowSkeleton = () => {
  return (
    <div className="flex h-28 flex-col gap-4 bg-white p-4 sm:px-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-60" />
      </div>
    </div>
  );
};
