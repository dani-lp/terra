import { achievementTierColors, classNames } from '@/const';
import { TrophyIcon } from '@heroicons/react/24/solid';
import type { AchievementTier, ChallengeTag } from '@prisma/client';
import { useTranslation } from 'next-i18next';

type Props = {
  tag: ChallengeTag;
  tier: AchievementTier;
  entries: number;
};

export const AchievementCardSmall = ({ tag, tier, entries }: Props) => {
  const { t } = useTranslation('common');
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={classNames(
          achievementTierColors[tier],
          'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium',
        )}
      >
        <TrophyIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <p className="font-medium capitalize text-gray-900">{t(`tags.${tag}`)}</p>
          <p className="text-gray-500">{t('users.achievementEntries', { count: entries })}</p>
        </div>
      </div>
    </li>
  );
};
