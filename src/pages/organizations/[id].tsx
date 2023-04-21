import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { MainLayout } from '@/components/common';
import { OrgDetailsView } from '@/components/organizations';
import type { NextPageWithLayout } from '../_app';

const OrganizationDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const orgId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      <OrgDetailsView orgDetailsId={orgId} />
    </>
  );
};

export default OrganizationDetailsPage;

OrganizationDetailsPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'navigation', 'orgs'], nextI18nConfig, [
      'en',
    ])),
  },
});
