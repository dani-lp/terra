import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import {
  OrgDetailsHeader,
  OrgDetailsMobileContent,
  OrgsDetailsHeaderSkeleton,
} from '@/components/organizations/details';
import { trpc } from '@/utils/trpc';

type Props = {
  orgDetailsId: string | undefined;
};

export const OrgDetailsView = ({ orgDetailsId }: Props) => {
  const { t } = useTranslation('common');
  const { data, isLoading, isError, error } = trpc.user.getOrgDetails.useQuery({
    orgDetailsId: orgDetailsId ?? '',
  });

  if (isError) {
    // TODO error page
    console.error(error);
    return null;
  }

  return (
    <>
      {data ? (
        <Head>
          <title>{t('titles.organizationDetailsName', { name: data.orgDetails.name })}</title>
        </Head>
      ) : (
        <Head>{t('titles.organizationDetails')}</Head>
      )}
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 md:p-4">
        <div className="flex flex-col gap-2 md:col-span-1">
          {isLoading && <OrgsDetailsHeaderSkeleton />}
          {!isLoading && data !== null && (
            <OrgDetailsHeader
              org={data.orgDetails}
              about={data.about}
              challengeCount={data.challengeCount}
            />
          )}
        </div>

        <div className="md:col-span-1">
          <OrgDetailsMobileContent orgDetailsId={orgDetailsId ?? ''} />
        </div>
      </div>
    </>
  );
};
