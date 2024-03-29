import { useTranslation } from 'next-i18next';
import { createPortal } from 'react-dom';

import { NewChallengeSlideOver } from '@/components/challenges/NewChallengeSlideOver';
import { SearchBar } from '@/components/common/form/SearchBar';
import { classNames } from '@/const';
import { useChallengeSearch, useChallengeSearchActions } from '@/store/useChallengeSearchStore';

type Props = {
  showNewChallengeButton?: boolean;
  usePortal?: boolean;
  className?: string;
};

export const ChallengesViewTopBar = ({
  showNewChallengeButton = false,
  usePortal = false,
  className = '',
}: Props) => {
  const { t } = useTranslation('challenges');
  const search = useChallengeSearch();
  const { setSearchString } = useChallengeSearchActions();

  if (usePortal) {
    return (
      <>
        {createPortal(
          <>
            <SearchBar
              value={search}
              onChange={(e) => setSearchString(e.currentTarget.value)}
              placeholder={t('challenges.details.searchChallenges') ?? ''}
              className="mb-0 h-10"
            />
            {showNewChallengeButton && <NewChallengeSlideOver />}
          </>,
          document.getElementById('topbar-portal-container') as HTMLElement,
        )}
      </>
    );
  }

  return (
    <div
      className={classNames('sticky top-0 z-10 hidden w-full justify-center lg:flex', className)}
    >
      <div className="flex h-full w-full max-w-6xl items-center justify-between gap-2">
        <SearchBar
          value={search}
          onChange={(e) => setSearchString(e.currentTarget.value)}
          placeholder={t('challenges.details.searchChallenges') ?? ''}
          className="mb-0 h-10"
        />
        {showNewChallengeButton && <NewChallengeSlideOver />}
      </div>
    </div>
  );
};
