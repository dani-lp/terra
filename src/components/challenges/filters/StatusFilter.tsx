import * as React from 'react';
import { SelectField, type SelectOption } from '@/components/common';
import {
  statusOptions,
  useChallengeSearchActions,
  useChallengeSearchStatus,
} from '@/store/useChallengeSearchStore';


export const StatusFilter = () => {
  const status = useChallengeSearchStatus();
  const { setStatus } = useChallengeSearchActions();

  return (
    <SelectField
      label="Status"  // TODO i18n
      options={statusOptions as SelectOption[]}
      selected={status}
      setSelected={setStatus}
    />
  );
};