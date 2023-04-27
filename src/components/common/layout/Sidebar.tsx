import { useNavigation, type NavItem } from '@/components/common/layout/context/NavigationContext';
import { NavigationButtons } from '@/components/common/layout/NavigationButtons';
import { filterNavigationItems } from '@/components/common/layout/utils';
import { classNames } from '@/const';
import { useSidebarActions } from '@/store/useSidebarStore';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Skeleton } from '../skeleton';

const montserrat = Montserrat({ subsets: ['latin'] });

type NavigationItemProps = {
  item: NavItem;
  active: boolean;
};

const NavigationItem = ({ item, active }: NavigationItemProps) => {
  const { setSidebarOpen } = useSidebarActions();
  const { t } = useTranslation('common');

  return (
    <Link
      href={item.to}
      key={item.key}
      className={classNames(
        'group flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors duration-200',
        active ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100',
      )}
      onClick={() => setSidebarOpen(false)}
    >
      <div className="flex items-center justify-center gap-2">
        <item.icon className="w-6" />
        {t(`sidebar.items.${item.key}`)}
      </div>
      {item.number !== undefined && (
        <div
          className={classNames(
            'rounded-full py-1 px-3 text-xs font-bold transition-colors duration-200',
            active ? 'bg-neutral-700' : 'bg-neutral-200 group-hover:bg-neutral-300',
          )}
        >
          {item.number}
        </div>
      )}
    </Link>
  );
};

const SidebarNavigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const navigationItems = useNavigation();

  const isLoading = status === 'loading';

  const filteredNavigationItems = filterNavigationItems(navigationItems, session?.user?.role);

  return (
    <nav className="flex flex-col gap-3 overflow-hidden p-2">
      {isLoading && (
        <>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
        </>
      )}
      {!isLoading &&
        filteredNavigationItems.map((item) => (
          <NavigationItem key={item.key} item={item} active={router.pathname === item.to} />
        ))}
    </nav>
  );
};

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center gap-6 px-2 py-4">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <h1 className={classNames('text-5xl font-bold uppercase', montserrat.className)}>Terra</h1>
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  const isLoading = status === 'loading';

  return (
    <>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <aside className="h-screen-mobile fixed z-20 w-72 bg-white px-1 shadow-md">
        <div className="flex h-full flex-col justify-between divide-y-2 divide-gray-200">
          <div className="flex flex-col gap-0 divide-y-2 divide-gray-200">
            <Logo />
            <SidebarNavigation />
          </div>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="overflow-hidden rounded-xl border border-neutral-400 p-0.5">
                  {isLoading ? (
                    <Skeleton className="h-[38px] w-[38px]" />
                  ) : (
                    <Image
                      src={session?.user?.image ?? '/logo.png'}
                      alt="logo"
                      width={38}
                      height={38}
                      className="rounded-lg"
                    />
                  )}
                </div>
                <div className="flex flex-col items-start justify-center text-sm">
                  {isLoading ? (
                    <div className="mb-2">
                      <Skeleton className="h-3 w-28" />
                    </div>
                  ) : (
                    <span className="max-w-[100px] overflow-hidden text-ellipsis font-bold">
                      {session?.user?.name?.split(' ')[0] ?? t('sidebar.userInfo.unknownUser')}
                    </span>
                  )}
                  <span className="text-neutral-700">
                    {isLoading ? (
                      <Skeleton className="h-3 w-24" />
                    ) : session?.user?.role ? (
                      t(`roles.${session.user.role}`)
                    ) : (
                      t('roles.PLAYER')
                    )}
                  </span>
                </div>
              </div>
              <NavigationButtons hideUser className="flex lg:hidden" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
