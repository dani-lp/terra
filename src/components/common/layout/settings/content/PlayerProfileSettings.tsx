import { InputField, TextareaField } from '@/components/common/form';
import { ActionButtons } from '@/components/common/layout/settings/content/ActionButtons';
import { trpc } from '@/utils/trpc';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

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
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const { data, isLoading, isError, error } = trpc.settings.getPlayerProfileInfo.useQuery();
  const updateInfoMutation = trpc.settings.updatePlayerProfile.useMutation({
    onSuccess: async () => {
      await utils.settings.getPlayerProfileInfo.invalidate();
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: data?.name ?? '',
      username: data?.username ?? '',
      about: data?.about ?? '',
    },
    onSubmit: async (values) => {
      console.log(values);
    },
    enableReinitialize: true,
  });

  const loading = isLoading;

  if (isError) {
    console.error(error);
    return null;
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
      </div>

      <ActionButtons handleClose={handleClose} />
    </form>
  );
};
