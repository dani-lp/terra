import * as React from 'react';
import { ChallengesFilterGroup } from '@/components/challenges/filters';
import { useChallengeSearch, useChallengeSearchActions } from '@/store/useChallengeSearchStore';
import { SearchBar } from '@/components/common/form/SearchBar';

export const SmallFilterGroup = () => {
  const search = useChallengeSearch();
  const { setSearchString } = useChallengeSearchActions();
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  return (
    <>
      <SearchBar
        value={search}
        onChange={(e) => setSearchString(e.currentTarget.value)}
        placeholder="Search your challenges..." // TODO i18n
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
