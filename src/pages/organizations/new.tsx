import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useFormik } from 'formik';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import nextI18nConfig from '@/../next-i18next.config.mjs';
import { Button } from '@/components/common';
import { ConfirmSubmissionModal, LogOutModal } from '@/components/organizations';
import { classNames, QUERY_PARAM_CALLBACK_URL } from '@/const';
import { trpc } from '@/utils/trpc';

const inter = Inter({ subsets: ['latin'] });

type PageHeaderProps = {
  onLogOut: () => void;
  onSubmit: () => void;
};

const PageHeader = ({ onLogOut, onSubmit }: PageHeaderProps) => {
  const { t } = useTranslation('newOrg');

  return (
    <div className="m-4 -mb-5 flex items-center justify-between gap-4 sm:mx-0 md:mb-0">
      <div className="flex min-w-0 flex-1 items-center justify-start gap-4">
        <Image className="hidden lg:block" height={42} width={42} src="/logo.png" alt="Terra" />
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('header')}
        </h2>
      </div>
      <div className="flex flex-col gap-2 md:mt-0 md:flex-row">
        <Button onClick={onLogOut} variant="inverseRed" noBorder type="button">
          {t('actions.logOut')}
        </Button>
        <Button onClick={onSubmit} type="button">
          {t('actions.submit')}
        </Button>
      </div>
    </div>
  );
};

type ProfileFormData = {
  name: string;
  username: string;
  website: string;
  about: string;
};

type PrivateFormData = {
  country: string; // TODO strongly type?
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

const SignIn: NextPage = () => {
  const { t } = useTranslation('newOrg');
  const router = useRouter();
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [logOutModalOpen, setLogOutModalOpen] = React.useState(false);
  const utils = trpc.useContext();
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

  const updateProfileOrgData = trpc.auth.updateProfileOrgData.useMutation({
    onSuccess: async () => {
      await utils.auth.getProfileOrgData.invalidate();
    },
  });
  const updatePrivateOrgData = trpc.auth.updatePrivateOrgData.useMutation({
    onSuccess: async () => {
      await utils.auth.getPrivateOrgData.invalidate();
    },
  });
  const submitRequest = trpc.auth.submitRegistrationRequest.useMutation();

  /**
   * Workflow:
   * 1.- Fetch information from DB, in two different queries
   * 2.- When clicking on "save", save it to the DB, in two different mutations
   * 3.- When clicking on "cancel", the newly added data is discarded and the old one is added
   * 4.- If "submit" is clicked when data is wrong/incomplete, show errors in the form
   * 5.- If "submit" is clicked when data is correct, show a confirmation message that sends the activation request
   */

  const profileForm = useFormik<ProfileFormData>({
    initialValues: {
      name: profileOrgData?.name || '',
      username: profileOrgData?.username || '',
      website: profileOrgData?.website || '',
      about: profileOrgData?.about || '',
    },
    onSubmit: (values) => {
      updateProfileOrgData.mutate(values);
    },
    enableReinitialize: true,
  });

  const privateForm = useFormik<PrivateFormData>({
    initialValues: {
      country: privateOrgData?.country || '',
      address: privateOrgData?.address || '',
      city: privateOrgData?.city || '',
      state: privateOrgData?.state || '',
      zip: privateOrgData?.zip || '',
      phone: privateOrgData?.phone || '',
    },
    onSubmit: (values) => {
      updatePrivateOrgData.mutate(values);
    },
    enableReinitialize: true,
  });

  const submissionStatus = profileOrgData?.status ?? 'UNSUBMITTED';

  React.useEffect(() => {
    const redirectTo = async () => {
      if (submissionStatus !== 'UNSUBMITTED') {
        await router.push('/organizations/waiting-room');
      }
    };
    void redirectTo();
  }, [router, submissionStatus]);

  const handleOpenConfirmModal = () => {
    // TODO validation
    setConfirmModalOpen(true);
  };

  const handleSubmit = () => {
    return null;
  };

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

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <main
        className={classNames(
          'flex h-full min-h-screen w-full justify-center bg-neutral-100 sm:px-4 md:py-4 lg:py-16',
          inter.className,
        )}
      >
        <div className="max-w-7xl space-y-10 divide-y divide-gray-900/10">
          <PageHeader onLogOut={() => setLogOutModalOpen(true)} onSubmit={handleOpenConfirmModal} />

          <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {t('profile.title')}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">{t('profile.message')}</p>
            </div>

            <form
              onSubmit={profileForm.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('profile.organizationName')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileForm.values.name}
                        onChange={profileForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('profile.username')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                        <span className="-mt-0.5 flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          @
                        </span>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={profileForm.values.username}
                          onChange={profileForm.handleChange}
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('profile.website')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          http://
                        </span>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          value={profileForm.values.website}
                          onChange={profileForm.handleChange}
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('profile.about')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        value={profileForm.values.about}
                        onChange={profileForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {t('profile.aboutMessage')}
                    </p>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('profile.photo')}
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                      <Button type="button" variant="inverseBlack">
                        {t('profile.change')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 p-4 sm:px-8">
                <button
                  onClick={profileForm.handleReset}
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {t('actions.cancel')}
                </button>
                <Button
                  disabled={isProfileOrgDataLoading || updateProfileOrgData.isLoading}
                  type="submit"
                >
                  {t('actions.save')}
                </Button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {t('private.title')}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">{t('private.message')}</p>
            </div>

            <form
              onSubmit={privateForm.handleSubmit}
              onBlur={privateForm.handleBlur}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('private.country')}
                      <span className="text-red-500"> *</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('private.streetAddress')}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={privateForm.values.address}
                        onChange={privateForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('private.city')}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={privateForm.values.city}
                        onChange={privateForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('private.state')}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={privateForm.values.state}
                        onChange={privateForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('private.postalCode')}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="zip"
                        id="zip"
                        value={privateForm.values.zip}
                        onChange={privateForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {t('private.phoneNumber')}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={privateForm.values.phone}
                        onChange={privateForm.handleChange}
                        className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 p-4 sm:px-8">
                <button
                  onClick={privateForm.handleReset}
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {t('actions.cancel')}
                </button>
                <Button
                  disabled={isPrivateOrgDataLoading || updatePrivateOrgData.isLoading}
                  type="submit"
                >
                  {t('actions.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <ConfirmSubmissionModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        submissionLoading={submitRequest.isLoading}
        onSubmit={handleSubmit}
      />

      <LogOutModal open={logOutModalOpen} setOpen={setLogOutModalOpen} t={t} />
    </>
  );
};

export default SignIn;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!session || session?.user?.role !== 'ORGANIZATION') {
    return {
      redirect: {
        destination: `/auth/signin?${QUERY_PARAM_CALLBACK_URL}=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? '', ['newOrg'], nextI18nConfig, ['en'])),
    },
  };
};
