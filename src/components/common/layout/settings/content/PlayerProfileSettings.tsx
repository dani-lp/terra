import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import * as React from 'react';

import { InputField, TextareaField } from '@/components/common/form';
import { ActionButtons } from '@/components/common/layout/settings/content/ActionButtons';
import { Skeleton } from '@/components/common';
import type { TerraFileRouter } from '@/server/uploadthing';
import { trpc } from '@/utils/trpc';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { type FileWithPath, useDropzone } from 'react-dropzone';

const { useUploadThing } = generateReactHelpers<TerraFileRouter>();

type FormValues = {
  name: string;
  username: string;
  about: string;
};

type Props = {
  handleClose: () => void;
};

export const PlayerProfileSettings = ({ handleClose }: Props) => {
  const { t } = useTranslation('common');
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const { data: session, status } = useSession();

  const onDrop = React.useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const { startUpload } = useUploadThing({
    endpoint: 'pfpUploader',
  });

  const utils = trpc.useContext();
  const { data, isLoading, isError, error } = trpc.settings.getPlayerProfileInfo.useQuery();
  const updateInfoMutation = trpc.settings.updatePlayerProfile.useMutation({
    onSuccess: async () => {
      await utils.settings.getPlayerProfileInfo.invalidate();
      handleClose();
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: data?.name ?? '',
      username: data?.username ?? '',
      about: data?.about ?? '',
    },
    onSubmit: async (values) => {
      const newErrors: string[] = [];

      if (!values.name) {
        newErrors.push(t('settings.errors.missingNamePlayers'));
      } else if (values.name.length < 3) {
        newErrors.push(t('settings.errors.shortNamePlayers'));
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

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      let pfpUrl: string | undefined;
      if (files.length > 0) {
        setUploading(true);
        const uploadResult = await startUpload(files);
        if (uploadResult) {
          pfpUrl = uploadResult[0]?.fileUrl;
        }
        setUploading(false);
      }

      updateInfoMutation.mutate({
        ...values,
        pfpUrl,
      });
      handleClose();
    },
    enableReinitialize: true,
  });

  const loading = isLoading || updateInfoMutation.isLoading || uploading;
  const loadingImages = status === 'loading' && isLoading;

  if (isError) {
    console.error(error);
    return null;
  }

  const resetFiles = () => {
    setFiles([]);
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative flex h-full w-full flex-col items-start overflow-auto"
    >
      <span className="w-full p-4 text-sm text-neutral-500 sm:px-6 sm:text-base">
        {t('settings.descriptions.profileDescription')}
      </span>

      <div className="flex w-full flex-col p-4 sm:p-6 lg:flex-row">
        <div className="grow space-y-6">
          <InputField
            id="name"
            label={t('settings.fields.name') ?? ''}
            className="h-[42px]"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />

          <InputField
            id="username"
            name="username"
            label={t('settings.fields.username') ?? ''}
            className="h-[42px]"
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
            <p className="mt-2 text-sm text-gray-500">{t('settings.descriptions.aboutPlayer')}</p>
          </div>
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
                {loadingImages && <Skeleton rounded className="h-32 w-32" />}
                {!loadingImages && (
                  <Image
                    className="h-full w-full rounded-full"
                    src={data?.image ?? session?.user?.image ?? ''}
                    alt=""
                    height={128}
                    width={128}
                  />
                )}
              </div>
              {/* mobile "change" button */}
              <div className="ml-5 rounded-md shadow-sm" {...getRootProps()}>
                <div className="group relative flex items-center justify-center rounded-lg border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-black hover:bg-gray-50">
                  <label
                    htmlFor="mobile-user-photo"
                    className="relative text-sm font-medium leading-4 text-gray-700"
                  >
                    <span>{t('settings.fields.photoOverlay')}</span>
                    <span className="sr-only">{t('settings.fields.photoOverlayA11y')}</span>
                  </label>
                  <input
                    id="mobile-user-photo"
                    name="user-photo"
                    type="file"
                    className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                    {...getInputProps()}
                  />
                </div>
              </div>
              {files.length > 0 && (
                <p className="ml-4 text-xs leading-5 text-gray-600 lg:hidden">
                  {t('settings.newImageFile')}
                  {files[0]?.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className="relative hidden overflow-hidden rounded-full lg:block"
              {...getRootProps()}
            >
              {loadingImages && <Skeleton rounded className="h-40 w-40" />}
              {!loadingImages && (
                <Image
                  className="relative h-40 w-40 rounded-full"
                  src={data?.image ?? session?.user?.image ?? ''}
                  alt=""
                  height={160}
                  width={160}
                />
              )}
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
              <p className="hidden text-xs leading-5 text-gray-600 lg:block">
                {t('settings.newImageFile')}
                {files[0]?.name}
              </p>
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
        loading={loading}
      />
    </form>
  );
};
