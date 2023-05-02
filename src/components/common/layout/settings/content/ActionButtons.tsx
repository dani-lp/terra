import { Button } from '@/components/common/button';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type Props = {
  handleClose: () => void;
};

export const ActionButtons = ({ handleClose }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="sticky bottom-0 left-0 mt-auto flex h-[70px] w-full justify-between border-t-2 border-gray-100 bg-white p-4 sm:px-8">
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
  );
};
