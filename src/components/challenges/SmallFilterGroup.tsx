import { useTranslation } from 'next-i18next';
import * as React from 'react';

import { ChallengesFilterGroup } from '@/components/challenges/filters';
import { SearchBar } from '@/components/common/form/SearchBar';
import { useChallengeSearch, useChallengeSearchActions } from '@/store/useChallengeSearchStore';

export const SmallFilterGroup = () => {
  const { t } = useTranslation('challenges');
  const search = useChallengeSearch();
  const { setSearchString } = useChallengeSearchActions();
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  return (
    <>
      <SearchBar
        value={search}
        onChange={(e) => setSearchString(e.currentTarget.value)}
        placeholder={t('challenges.details.searchChallenges') ?? ''}
        className="mb-0"
        withButton
        squaredBottom={filtersOpen}
        buttonText="Filters"
        buttonVariant={filtersOpen ? 'primary' : 'inverse'}
        onClick={() => setFiltersOpen(!filtersOpen)}
      />
      {filtersOpen && <ChallengesFilterGroup className="w-full rounded-t-none" />}
    </>
  );
};
