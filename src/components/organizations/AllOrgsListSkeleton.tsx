import { Skeleton } from '@/components/common';

export const AllOrgsListSkeleton = () => {
  return (
    <div className="h-full w-full overflow-y-auto" aria-label="Directory">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="relative">
          <Skeleton className="h-9" widthFull />
          <ul role="list" className="divide-y divide-gray-100">
            <li>
              <div className="flex gap-x-4 px-3 py-5 transition-colors">
                <Skeleton className="h-12 w-12" rounded />
                <div className="min-w-0">
                  <Skeleton className="h-5 w-44" />
                  <div className="mt-1">
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};
