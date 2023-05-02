import { useTranslation } from 'next-i18next';

import { InputField, TextareaField } from '@/components/common/form';
import { trpc } from '@/utils/trpc';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type FormValues = {
  organizationName: string;
  username: string;
  about: string;
  website: string;
  country: string;
};

export const OrgProfileSettings = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const { data, isLoading, isError, error } = trpc.settings.getOrgProfileInfo.useQuery();
  const updateInfoMutation = trpc.settings.updateOrgProfile.useMutation({
    onSuccess: async () => {
      await utils.settings.getOrgProfileInfo.invalidate();
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      organizationName: data?.organizationName ?? '',
      username: data?.username ?? '',
      about: data?.about ?? '',
      website: data?.website ?? '',
      country: data?.country ?? '',
    },
    onSubmit: async (values) => {
      console.log(values);
    },
    enableReinitialize: true,
  });

  if (isError) {
    console.error(error);
    return null;
  }

  const loading = isLoading;

  return (
    <div className="h-full w-full">
      <span className="text-sm text-neutral-500 sm:text-base">
        {t('settings.descriptions.profileDescription')}
      </span>

      <form className="mt-6 flex flex-col lg:flex-row">
        <div className="grow space-y-6">
          <InputField
            id="organizationName"
            label={t('settings.fields.organizationName') ?? ''}
            name="organizationName"
            value={formik.values.organizationName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />

          <InputField
            id="username"
            label={t('settings.fields.username') ?? ''}
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />

          <div>
            <TextareaField
              id="about"
              label={t('settings.fields.about') ?? ''}
              name="About"
              rows={3}
              value={formik.values.about}
              onChange={formik.handleChange}
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">{t('settings.descriptions.aboutOrg')}</p>
          </div>

          <div>
            <InputField
              id="website"
              label={t('settings.fields.website') ?? ''}
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">{t('settings.descriptions.websiteUrl')}</p>
          </div>

          <InputField
            id="country"
            label={t('settings.fields.country') ?? ''}
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
        </div>

        <div className="mt-6 grow lg:mt-0 lg:ml-6 lg:shrink-0 lg:grow-0">
          <p className="text-sm font-medium text-gray-700" aria-hidden="true">
            {t('settings.fields.photo')}
          </p>
          <div className="mt-1 lg:hidden">
            <div className="flex items-center">
              <div
                className="inline-block h-12 w-12 shrink-0 overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <Image
                  className="h-full w-full rounded-full"
                  src={session?.user?.image ?? ''}
                  alt=""
                  height={128}
                  width={128}
                />
              </div>
              <div className="ml-5 rounded-md shadow-sm">
                <div className="group relative flex items-center justify-center rounded-lg border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-black hover:bg-gray-50">
                  <label
                    htmlFor="mobile-user-photo"
                    className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                  >
                    <span>{t('settings.fields.photoOverlay')}</span>
                    <span className="sr-only">{t('settings.fields.photoOverlayA11y')}</span>
                  </label>
                  <input
                    id="mobile-user-photo"
                    name="user-photo"
                    type="file"
                    className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-full lg:block">
            <Image
              className="relative h-40 w-40 rounded-full"
              src={session?.user?.image ?? ''}
              alt=""
              height={160}
              width={160}
            />
            <label
              htmlFor="desktop-user-photo"
              className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
            >
              <span>{t('settings.fields.photoOverlay')}</span>
              <span className="sr-only">{t('settings.fields.photoOverlayA11y')}</span>
              <input
                type="file"
                id="desktop-user-photo"
                name="user-photo"
                className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
