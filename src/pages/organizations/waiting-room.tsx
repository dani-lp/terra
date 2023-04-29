import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import * as React from 'react';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { Button, Chip } from '@/components/common';
import { LogOutModal } from '@/components/organizations';
import {
  classNames,
  QUERY_PARAM_CALLBACK_URL,
  submissionStatusColors,
  submissionStatusDotColor,
} from '@/const';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NextPageWithLayout } from '../_app';

const inter = Inter({ subsets: ['latin'] });

const WaitingRoom: NextPageWithLayout = () => {
  const { t } = useTranslation('waitingRoom');
  const router = useRouter();
  const [logOutModalOpen, setLogOutModalOpen] = React.useState(false);
  const { data: session } = useSession();
  const {
    data: profileOrgData,
    isLoading: isProfileOrgDataLoading,
    isError: isProfileOrgDataError,
    error: profileOrgDataError,
  } = trpc.auth.getProfileOrgData.useQuery();
  const {
    data: privateOrgData,
    isLoading: isPrivateOrgDataLoading,
    isError: isPrivateOrgDataError,
    error: privateOrgDataError,
  } = trpc.auth.getPrivateOrgData.useQuery();

  const isLoading = isProfileOrgDataLoading || isPrivateOrgDataLoading;
  const isError = isProfileOrgDataError || isPrivateOrgDataError;

  const submissionStatus = profileOrgData?.status ?? 'PENDING';
  const rejectionMessage = profileOrgData?.rejectionMessage ?? '';

  React.useEffect(() => {
    const redirectTo = async () => {
      if (submissionStatus === 'UNSUBMITTED') {
        await router.push('/organizations/new');
      }
    };
    void redirectTo();
  }, [router, submissionStatus]);

  if (isLoading) {
    // TODO loading page
    return null;
  }

  if (isError) {
    if (isProfileOrgDataError) {
      console.error(profileOrgDataError);
    }
    if (isPrivateOrgDataError) {
      console.error(privateOrgDataError);
    }
    // TODO error page
    return null;
  }
  const listEntries = [
    {
      label: t('fields.organizationName'),
      value: profileOrgData?.name,
      asLink: false,
      required: true,
    },
    { label: t('fields.username'), value: profileOrgData?.username, asLink: false, required: true },
    { label: t('fields.website'), value: profileOrgData?.website, asLink: true, required: true },
    { label: t('fields.email'), value: session?.user?.email, asLink: false, required: true },
    { label: t('fields.about'), value: profileOrgData?.about, asLink: false, required: true },
    { label: t('fields.country'), value: privateOrgData?.country, asLink: false, required: true },
    {
      label: t('fields.streetAddress'),
      value: privateOrgData?.address,
      asLink: false,
      required: false,
    },
    { label: t('fields.city'), value: privateOrgData?.city, asLink: false, required: false },
    { label: t('fields.state'), value: privateOrgData?.state, asLink: false, required: false },
    { label: t('fields.postalCode'), value: privateOrgData?.zip, asLink: false, required: false },
    {
      label: t('fields.phoneNumber'),
      value: privateOrgData?.phone,
      asLink: false,
      required: false,
    },
  ];

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <main className={classNames('flex justify-center bg-neutral-100', inter.className)}>
        <div className="grid max-w-6xl grid-cols-1 gap-x-8 gap-y-0 lg:grid-cols-3">
          <div className="px-4 py-6 sm:p-8 lg:col-span-1">
            <h1 className="text-2xl font-semibold leading-7 text-gray-900">
              {t('applicationStatus')}
            </h1>
            <p className="mt-2 text-gray-700">{t('description')}</p>
            <div className="mt-10 flex items-center justify-start gap-4">
              <p className="font-medium">{t('status.title')}:</p>
              <Chip
                className={submissionStatusColors[submissionStatus]}
                label={t(`status.${submissionStatus.toLowerCase()}`)}
                dotColor={submissionStatusDotColor[submissionStatus]}
              />
            </div>
            <p className="mt-2">{t(`statusDescription.${submissionStatus.toLowerCase()}`)}</p>
            {submissionStatus === 'REJECTED' && rejectionMessage && (
              <p className="mt-4">
                <span className="font-semibold">{t('other.reason')}: </span>
                {rejectionMessage}
              </p>
            )}
            {submissionStatus === 'ACCEPTED' && (
              <div className="mt-4">
                <Link href="/">
                  <Button className="w-full">{t('other.goHome')}</Button>
                </Link>
              </div>
            )}
            <div className="mt-4">
              <Button
                variant="primaryRed"
                noBorder
                onClick={() => setLogOutModalOpen(true)}
                className="w-full"
              >
                {t('other.logOut')}
              </Button>
            </div>
          </div>
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:m-4 sm:rounded-xl lg:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:px-0">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">
                  {t('applicationInfo')}
                </h3>
              </div>
              <div className="mt-4 border-t border-neutral-300">
                <dl className="divide-y divide-neutral-200">
                  {listEntries.map((entry) => (
                    <div key={entry.label} className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        {entry.label}
                        {entry.required && <span className="text-red-500"> *</span>}
                      </dt>
                      {entry.asLink ? (
                        <a
                          href={entry.value ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 text-sm leading-6 text-gray-700 underline sm:col-span-2 sm:mt-0"
                        >
                          {entry.value}
                        </a>
                      ) : (
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {entry.value}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LogOutModal open={logOutModalOpen} setOpen={setLogOutModalOpen} t={t} />
    </>
  );
};

export default WaitingRoom;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session || session.user?.role !== 'ORGANIZATION') {
    return {
      redirect: {
        destination: `/auth/signin?${QUERY_PARAM_CALLBACK_URL}=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
      ...(await serverSideTranslations(context.locale ?? '', ['waitingRoom'], nextI18nConfig, [
        'en',
      ])),
    },
  };
};
