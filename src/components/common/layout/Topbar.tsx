import { Bars3Icon } from '@heroicons/react/24/outline';
import { Inter } from 'next/font/google';
import Image from 'next/image';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '@/components/common/layout/context/NavigationContext';
import { NavigationButtons } from '@/components/common/layout/NavigationButtons';
import { filterNavigationItems } from '@/components/common/layout/utils';
import { classNames } from '@/const';

const inter = Inter({ subsets: ['latin'] });

const TopBarNavigation = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();
  const navigationItems = useNavigation();

  const filteredNavigationItems = filterNavigationItems(navigationItems, session?.user?.role);

  return (
    <>
      {filteredNavigationItems.map((item) => (
        <Link
          href={item.to}
          key={item.to}
          className={classNames(
            'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
            router.pathname === item.to
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-neutral-100',
          )}
        >
          <div className="flex w-full items-center justify-center gap-2">
            <item.icon className="w-6" />
            {t(`sidebar.items.${item.key}`)}
          </div>
        </Link>
      ))}
    </>
  );
};

type Props = {
  setSidebarOpen: (open: boolean) => void;
};

export const TopBar = ({ setSidebarOpen }: Props) => {
  const { t } = useTranslation('common');

  return (
    <div className={inter.className}>
      <div className="fixed z-20 flex h-16 w-screen items-center justify-center border-b border-neutral-200 bg-white px-4 py-1.5">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center justify-center">
            <div>
              <Image className="h-8 w-auto" height={32} width={32} src="/logo.png" alt="Terra" />
            </div>
            <div className="ml-6 hidden space-x-2 lg:flex">
              <TopBarNavigation />
            </div>
          </div>
          <div>
            <NavigationButtons />

            <div className="inline-flex lg:hidden">
              <button
                type="button"
                className="-mr-3 h-12 w-12 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">{t('a11y.openSidebar')}</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
