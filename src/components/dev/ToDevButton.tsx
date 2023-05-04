import Link from 'next/link';
import { BugAntIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';

export const ToDevButton = () => {
  const { t } = useTranslation('common');
  return (
    <Link
      href="/dev"
      className="fixed bottom-4 right-4 rounded-full bg-black p-4 text-white shadow transition-shadow hover:shadow-xl"
      aria-label={t('a11y.toDevLink') ?? 'navigate to developer view'}
    >
      <BugAntIcon className="w-7" />
    </Link>
  );
};
