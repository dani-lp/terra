import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';

import { InputField } from '@/components/common/form';
import { ActionButtons } from '@/components/common/layout/settings/content/ActionButtons';
import { trpc } from '@/utils/trpc';

type FormValues = {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

type Props = {
  handleClose: () => void;
};

export const AccountSettings = ({ handleClose }: Props) => {
  const { t } = useTranslation('common');
  const utils = trpc.useContext();
  const { data, isLoading, isError, error } = trpc.settings.getOrgPrivateInfo.useQuery();
  const updateInfoMutation = trpc.settings.updateOrgPrivate.useMutation({
    onSuccess: async () => {
      await utils.settings.getOrgPrivateInfo.invalidate();
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      phone: data?.phone ?? '',
      address: data?.address ?? '',
      city: data?.city ?? '',
      state: data?.state ?? '',
      zip: data?.zip ?? '',
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
      <span className="w-full p-4 text-sm text-neutral-500 sm:text-base">
        {t('settings.descriptions.accountDescription')}
      </span>

      <div className="flex w-full flex-col overflow-auto p-4 sm:p-6 lg:flex-row">
        <div className="grow space-y-6">
          <InputField
            id="address"
            label={t('settings.fields.address') ?? ''}
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <InputField
              id="city"
              label={t('settings.fields.city') ?? ''}
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <InputField
              id="state"
              label={t('settings.fields.state') ?? ''}
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <InputField
              id="zip"
              label={t('settings.fields.zip') ?? ''}
              name="zip"
              value={formik.values.zip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
          </div>

          <InputField
            id="phone"
            label={t('settings.fields.phone') ?? ''}
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
        </div>
      </div>

      <ActionButtons handleClose={handleClose} />
    </form>
  );
};
