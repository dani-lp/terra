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
      <div className="px-2 py-3 md:col-span-2 md:py-0">
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
