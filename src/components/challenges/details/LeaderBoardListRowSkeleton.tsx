import { Skeleton } from '@/components/common';

type Props = {
  position: number;
};

export const LeaderBoardListRowSkeleton = ({ position }: Props) => {
  return (
    <li className="grid h-14 grid-cols-9 items-center justify-between rounded-full px-4 transition-colors">
      <span className="col-span-1 text-sm font-medium">{position}.</span>
      <div className="col-span-6 flex items-center gap-3">
        <Skeleton rounded className="h-10 w-10" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-start">
        <div className="mr-2">
          <Skeleton rounded className="h-5 w-5" />
        </div>
        <Skeleton className="h-3 w-10" />
      </div>
    </li>
  );
};
