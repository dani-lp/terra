import { Dialog, Transition } from '@headlessui/react';
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
import { LogOutModal, OrgDetailsList, type OrgDetailsListEntry } from '@/components/organizations';
import {
  classNames,
  QUERY_PARAM_CALLBACK_URL,
  QUERY_PARAM_WAITING_ROOM_GREET,
  submissionStatusColors,
  submissionStatusDotColor,
} from '@/const';
import { useQueryParams } from '@/hooks/useQueryParams';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/server/db/client';
import { trpc } from '@/utils/trpc';
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { NextPageWithLayout } from '../_app';

const inter = Inter({ subsets: ['latin'] });

const GreetingModal = () => {
  const { t } = useTranslation('waitingRoom');
  const { getParamValue, removeParam } = useQueryParams();

  const open = getParamValue(QUERY_PARAM_WAITING_ROOM_GREET) === 'true';
  const handleClose = async () => {
    await removeParam(QUERY_PARAM_WAITING_ROOM_GREET);
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {t('greetingModal.title')}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{t('greetingModal.message')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <Button type="button" className="w-full" onClick={handleClose}>
                    {t('greetingModal.close')}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const WaitingRoom: NextPageWithLayout = () => {
  const { t } = useTranslation('waitingRoom');
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

  const listEntries: OrgDetailsListEntry[] = [
    {
      label: t('fields.organizationName'),
      value: profileOrgData?.name ?? '',
      asLink: false,
      required: true,
    },
    {
      label: t('fields.username'),
      value: profileOrgData?.username ?? '',
      asLink: false,
      required: true,
    },
    {
      label: t('fields.website'),
      value: profileOrgData?.website ?? '',
      asLink: true,
      required: true,
    },
    { label: t('fields.email'), value: session?.user?.email ?? '', asLink: false, required: true },
    { label: t('fields.about'), value: profileOrgData?.about ?? '', asLink: false, required: true },
    {
      label: t('fields.country'),
      value: privateOrgData?.country ?? '',
      asLink: false,
      required: true,
    },
    {
      label: t('fields.streetAddress'),
      value: privateOrgData?.address ?? '',
      asLink: false,
      required: false,
    },
    { label: t('fields.city'), value: privateOrgData?.city ?? '', asLink: false, required: false },
    {
      label: t('fields.state'),
      value: privateOrgData?.state ?? '',
      asLink: false,
      required: false,
    },
    {
      label: t('fields.postalCode'),
      value: privateOrgData?.zip ?? '',
      asLink: false,
      required: false,
    },
    {
      label: t('fields.phoneNumber'),
      value: privateOrgData?.phone ?? '',
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
                <OrgDetailsList listEntries={listEntries} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <LogOutModal open={logOutModalOpen} setOpen={setLogOutModalOpen} t={t} />
      <GreetingModal />
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

  if (session) {
    const orgUserDetails = await prisma.userDetails.findUnique({
      where: { userId: session.user?.id },
      select: { id: true },
    });

    const organizationData = await prisma.organizationData.findUnique({
      where: { userDetailsId: orgUserDetails?.id },
      select: { approvalState: true },
    });

    if (organizationData?.approvalState === 'UNSUBMITTED') {
      return {
        redirect: {
          destination: '/organizations/new',
          permanent: false,
        },
      };
    }
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
