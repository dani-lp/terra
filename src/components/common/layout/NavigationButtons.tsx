import { Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';

import { settingsModalOpenAtom } from '@/components/common/layout/utils/atoms';
import { Skeleton } from '@/components/common/skeleton';
import { classNames } from '@/const';

type Props = {
  className?: string;
};

export const NavigationButtons = ({ className }: Props) => {
  const [settingsModalOpen, setSettingsModalOpen] = useAtom(settingsModalOpenAtom);
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className={classNames('items-center justify-center gap-2 p-2', className)}>
      {/* TODO redirect to use profile */}
      {session?.user?.role !== 'ADMIN' && (
        <div className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-black hover:text-white">
          {isLoading && <Skeleton className="h-6 w-6" />}
          {!isLoading && <UserIcon className="w-6" />}
        </div>
      )}
      <button
        onClick={() => setSettingsModalOpen(!settingsModalOpen)}
        className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-black hover:text-white"
      >
        {isLoading && <Skeleton className="h-6 w-6" />}
        {!isLoading && <Cog6ToothIcon className="w-6" />}
      </button>
    </div>
  );
};
