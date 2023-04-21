import { useTranslation } from 'next-i18next';
import * as React from 'react';

import { SearchBar } from '@/components/common/form/SearchBar';
import { AllOrgsList } from '@/components/organizations/AllOrgsList';

export const AllOrgsView = () => {
  const [search, setSearch] = React.useState<string>('');
  const { t } = useTranslation('orgs');

  const searchPlaceholder = t('search.placeholder');

  return (
    <div className="flex flex-col md:grid md:grid-cols-5 md:gap-4 md:p-4">
      <div className="mb-2 h-24 bg-white px-2 pb-3 pt-2 shadow md:col-span-2 md:rounded-lg md:pb-0">
        <h2 className="mb-2 text-lg font-medium">{t('search.title')}</h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>
      <div className="md:col-span-3">
        <AllOrgsList searchString={search} />
      </div>
    </div>
  );
};
