import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BugAntIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  HomeIcon,
  PaperClipIcon,
  RocketLaunchIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Montserrat } from '@next/font/google';
import { classNames } from '@/const';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { SettingsModal } from './settings/SettingsModal';
import { useSidebarActions } from '@/store/useSidebarStore';
import { playerUrls, orgUrls, adminUrls, urls } from '@/const/urls';
import { Skeleton } from '../skeleton';

const montserrat = Montserrat({ subsets: ['latin'] });

export type NavItem = {
  key: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  number?: number;
};

type NavigationItemProps = {
  item: NavItem;
  active: boolean;
};

const navigationItems: NavItem[] = [
  { key: 'home', to: urls.HOME, icon: HomeIcon },
  { key: 'challenges', to: urls.CHALLENGES, icon: RocketLaunchIcon },
  { key: 'organizations', to: urls.ORGANIZATIONS, icon: BuildingOffice2Icon },
  { key: 'drafts', to: urls.DRAFTS, icon: PaperClipIcon },
  { key: 'development', to: urls.DEVELOPMENT, icon: BugAntIcon },
];

const NavigationItem = ({ item, active }: NavigationItemProps) => {
  const { setSidebarOpen } = useSidebarActions();
  const { t } = useTranslation('navigation');

  return (
    <Link
      href={item.to}
      key={item.key}
      className={classNames(
        'flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors duration-200 group',
        active ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100 text-black'
      )}
      onClick={() => setSidebarOpen(false)}
    >
      <div className="flex items-center justify-center gap-2">
        <item.icon className="w-6" />
        {t(`sidebar.items.${item.key}`)}
      </div>
      {item.number !== undefined && (
        <div className={classNames(
          'text-xs font-bold py-1 px-3 rounded-full transition-colors duration-200',
          active ? 'bg-neutral-700' : 'bg-neutral-200 group-hover:bg-neutral-300'
        )}>
          {item.number}
        </div>
      )}
    </Link>
  );
};

const SidebarNavigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (item.to === urls.DEVELOPMENT && process.env.NODE_ENV === 'development') return true;  // TODO remove when development is done, or based on environment
    switch (session?.user?.role) {
      case 'ADMIN':
        return Object.values(adminUrls).some((url) => url === item.to);
      case 'ORGANIZATION':
        return Object.values(orgUrls).some((url) => url === item.to);
      case 'PLAYER':
        return Object.values(playerUrls).some((url) => url === item.to);
      default:
        return false;
    }
  });

  return (
    <nav className="flex flex-col gap-3 p-2">
      {isLoading && (
        <>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
        </>
      )}
      {!isLoading && filteredNavigationItems.map((item) => (
        <NavigationItem
          key={item.key}
          item={item}
          active={router.pathname === item.to}
        />
      ))}
    </nav>
  );
};

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center gap-6 px-2 py-4">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <h1 className={classNames('text-5xl font-bold uppercase', montserrat.className)}>
          Terra
        </h1>
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const { data: session, status } = useSession();
  const { t } = useTranslation('common');

  const isLoading = status === 'loading';

  return (
    <>
      <aside className="fixed z-20 h-screen w-72 bg-white px-1 shadow-md">
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
                    <Skeleton
                      className="h-[38px] w-[38px]"
                    />
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
                  <span className="font-bold">
                    {isLoading ? (
                      <Skeleton className="mb-2 h-3 w-28" />
                    ) : session?.user?.name ?? 'John Doe'}

                  </span>
                  <span className="text-neutral-700">
                    {isLoading ? (
                      <Skeleton className="h-3 w-24" />
                    ) : session?.user?.role
                      ? t(`roles.${session.user.role}`)
                      : t('roles.PLAYER')
                    }

                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 p-2">
                {/* TODO redirect to use profile */}
                {session?.user?.role !== 'ADMIN' && (
                  <div className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-black hover:text-white">
                    {isLoading && (
                      <Skeleton className="h-6 w-6" />
                    )}
                    {!isLoading && (
                      <UserIcon className="w-6" />
                    )}
                  </div>
                )}
                <button
                  onClick={() => setSettingsModalOpen(!settingsModalOpen)}
                  className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-black hover:text-white"
                >
                  {isLoading && (
                    <Skeleton className="h-6 w-6" />
                  )}
                  {!isLoading && (
                    <Cog6ToothIcon className="w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <SettingsModal open={settingsModalOpen} setOpen={setSettingsModalOpen} />
    </>
  );
};