import { classNames } from '@/const';
import { getLevelProgression } from '@/utils/gamification';
import { BoltIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'next-i18next';

type Props = {
  points: number;
  className?: string;
};

export const PlayerLevel = ({ points, className }: Props) => {
  const { t } = useTranslation('common');
  const { level, currentPoints, bottomBound, upperBound } = getLevelProgression(points);

  const percentage =
    level === 10 ? 100 : Math.round((currentPoints / (upperBound - bottomBound)) * 100);

  return (
    <div className={classNames('flex gap-3', className)}>
      <span className="inline-flex rounded-lg bg-purple-100 p-3 text-purple-700 ring-4 ring-white">
        <BoltIcon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="flex w-full flex-col items-start justify-center gap-1">
        <span className="truncate font-medium text-gray-600">{t('users.level', { level })}</span>
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div className="h-2.5 rounded-full bg-purple-600" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
};
