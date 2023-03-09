import * as React from 'react';
import { useRouter } from 'next/router';

import { QUERY_PARAM_CHALLENGE } from '@/const/queryParams';
import { Button, Modal } from '../common';
import Image from 'next/image';
import { ChallengeStats } from './ChallengeStats';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@/hooks/useQueryParams';

export const ChallengeDetailsModal = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { removeParam } = useQueryParams();
  const selectedChallengeId = router.query[QUERY_PARAM_CHALLENGE];

  const handleSetOpen = () => {
    removeParam(QUERY_PARAM_CHALLENGE);
  };

  return (
    <Modal
      open={!!selectedChallengeId}
      setOpen={handleSetOpen}
      fullScreen
      className="max-w-3xl sm:max-h-[500px]"
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-[300px] w-[500px] overflow-hidden rounded-lg object-cover sm:h-[500px] sm:rounded-none sm:p-0">
          <Image
            src="/img/beach-cleaning-example.jpg"
            alt="Beach cleaning"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start px-4 py-2 sm:py-6">
          <h2 className="mb-2 text-3xl font-semibold">Title of the challenge</h2>
          {/* TODO map paragraphs into <p> */}
          <p className="mb-2">Some smaller text describing the challenge {'blah '.repeat(50)}</p>
          <p className="mb-2">Even more text but a bit shorter{'blah '.repeat(20)}</p>
          <ChallengeStats endDate={'2024-01-01'} players={5297395} />
          <div className="mt-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            {/* TODO translate, use proper texts depending on user role, e.g. "edit" */}
            <Button className="w-full" variant="inverse" onClick={handleSetOpen}>
              {t('actions.close')}
            </Button>
            <Button className="w-full">{t('actions.join')}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
