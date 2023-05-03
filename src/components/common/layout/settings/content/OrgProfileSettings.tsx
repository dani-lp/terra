import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import * as React from 'react';

import { InputField, TextareaField } from '@/components/common/form';
import { urlRegex } from '@/const';
import type { TerraFileRouter } from '@/server/uploadthing';
import { trpc } from '@/utils/trpc';
import { generateReactHelpers } from '@uploadthing/react';
import { ActionButtons } from './ActionButtons';

const { useUploadThing } = generateReactHelpers<TerraFileRouter>();

type FormValues = {
  organizationName: string;
  username: string;
  about: string;
  website: string;
  country: string;
};

type Props = {
  handleClose: () => void;
};

export const OrgProfileSettings = ({ handleClose }: Props) => {
  const { t } = useTranslation('common');
  const [errors, setErrors] = React.useState<string[]>([]);
  const { data: session } = useSession();

  const { getRootProps, getInputProps, files, startUpload, resetFiles } =
    useUploadThing('proofUploader');
  const mobilePhotoInputRef = React.useRef<HTMLInputElement>(null);
  const handleMobilePhotoInputClick = () => {
    if (mobilePhotoInputRef.current) {
      mobilePhotoInputRef.current.click();
    }
  };

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
      const newErrors: string[] = [];

      if (!values.organizationName) {
        newErrors.push(t('settings.errors.missingNameOrgs'));
      } else if (values.organizationName.length < 3) {
        newErrors.push(t('settings.errors.shortNameOrgs'));
      }

      if (!values.username) {
        newErrors.push(t('settings.errors.missingUsername'));
      } else if (values.username.length < 3) {
        newErrors.push(t('settings.errors.shortUsername'));
      } else if (values.username.indexOf(' ') >= 0) {
        newErrors.push(t('settings.errors.usernameWithSpaces'));
      }

      if (!values.about) {
        newErrors.push(t('settings.errors.missingAbout'));
      } else if (values.about.length < 10) {
        newErrors.push(t('settings.errors.shortAbout'));
      }

      if (!values.website) {
        newErrors.push(t('settings.errors.missingWebsite'));
      } else if (!urlRegex.test(values.website)) {
        newErrors.push(t('profile.errors.invalidWebsite'));
      }

      if (!values.country) {
        newErrors.push(t('settings.errors.missingCountry'));
      } else if (values.country.length < 3) {
        newErrors.push(t('settings.errors.shortCountry'));
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      updateInfoMutation.mutate(values);
      handleClose();
    },
    enableReinitialize: true,
  });

  if (isError) {
    console.error(error);
    return null;
  }

  const loading = isLoading;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative flex h-full w-full flex-col items-start overflow-auto"
    >
      <span className="w-full p-4 text-sm text-neutral-500 sm:text-base">
        {t('settings.descriptions.profileDescription')}
      </span>

      <div className="flex w-full flex-col p-4 sm:p-6 lg:flex-row">
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
              name="about"
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
              {/* mobile "change" button */}
              <div className="ml-5 rounded-md shadow-sm" {...getRootProps()}>
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
                    name="mobile-user-photo"
                    type="file"
                    className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                    // ref={mobilePhotoInputRef}
                    {...getInputProps()}
                  />
                </div>
              </div>
              {files.length > 0 && (
                <div className="ml-5">{files.map((file) => file.file.name).concat(', ')}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className="relative hidden overflow-hidden rounded-full lg:block"
              {...getRootProps()}
            >
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
                  {...getInputProps()}
                />
              </label>
            </div>
            {files.length > 0 && (
              <p className="text-xs leading-5 text-gray-600">{files[0]?.file.name}</p>
            )}
          </div>
        </div>
      </div>

      <ActionButtons
        errors={errors}
        handleClose={() => {
          resetFiles();
          handleClose();
        }}
      />
    </form>
  );
};
