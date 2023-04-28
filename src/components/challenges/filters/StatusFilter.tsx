import { useTranslation } from 'next-i18next';

import { SelectField, type SelectOption } from '@/components/common';
import {
  statusOptions,
  useChallengeSearchActions,
  useChallengeSearchStatus,
} from '@/store/useChallengeSearchStore';

export const StatusFilter = () => {
  const { t } = useTranslation('challenges');
  const status = useChallengeSearchStatus();
  const { setStatus } = useChallengeSearchActions();

  return (
    <SelectField
      label={t('challenges.details.filters.status') ?? ''}
      options={statusOptions as SelectOption[]}
      selected={status}
      setSelected={setStatus}
    />
  );
};
