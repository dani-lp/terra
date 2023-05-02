import { Alert } from '@/components/common/alert';
import { Button } from '@/components/common/button';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type Props = {
  handleClose: () => void;
  errors: string[];
};

export const ActionButtons = ({ handleClose, errors }: Props) => {
  const { t } = useTranslation('common');

  return (
    <div className="sticky bottom-0 left-0 mt-auto flex w-full flex-col justify-between gap-2 border-t-2 border-gray-100 bg-white p-4 sm:px-8">
      <Alert
        shown={errors.length > 0}
        content={{
          type: 'error',
          title: t('settings.errors.title'),
          errors,
        }}
        className="w-full"
      />
      <div className="flex w-full justify-between">
        <div>
          <Button variant="inverseRed" noBorder onClick={() => signOut({ callbackUrl: '/' })}>
            {t('settings.buttons.logout')}
          </Button>
        </div>
        <div className="flex justify-end">
          <Button variant="inverse" onClick={handleClose}>
            {t('settings.buttons.cancel')}
          </Button>
          <Button type="submit" className="ml-5">
            {t('settings.buttons.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};
