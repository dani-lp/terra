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

const montserrat = Montserrat({ subsets: ['latin'] });

export type NavigationItem = {
  key: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  number?: number;
};

type NavigationItemProps = {
  item: NavigationItem;
  active: boolean;
};

const navigationItems: NavigationItem[] = [
  { key: 'home', to: '/', icon: HomeIcon },
  { key: 'challenges', to: '/challenges', icon: RocketLaunchIcon },
  { key: 'organizations', to: '/organizations', icon: BuildingOffice2Icon },
  { key: 'drafts', to: '/drafts', icon: PaperClipIcon },
  { key: 'development', to: '/dev', icon: BugAntIcon },
];

const NavigationItem = ({ item, active }: NavigationItemProps) => {
  const { t } = useTranslation('navigation');

  return (
    <Link
      href={item.to}
      key={item.key}
      className={classNames(
        'flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors duration-200 group',
        active ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100 text-black'
      )}
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
  const router = useRouter();

  return (
    <nav className="flex flex-col gap-3 p-2">
      {navigationItems.map((item) => (
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
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  return (
    <>

      <aside className="bg-white w-72 h-screen fixed shadow-md px-1">
        <div className="flex flex-col justify-between h-full divide-y-2 divide-gray-200">
          <div className="flex flex-col gap-0 divide-y-2 divide-gray-200">
            <Logo />
            <SidebarNavigation />
          </div>
          <div className="p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-left gap-2">
                <div className="border border-neutral-400 p-0.5 rounded-xl overflow-hidden">
                  <Image
                    src={session?.user?.image ?? '/logo.png'}
                    alt="logo"
                    width={38}
                    height={38}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col items-start justify-center text-sm">
                  <span className="font-bold">
                    {session?.user?.name ?? 'John Doe'}
                  </span>
                  <span className="text-neutral-700">
                    {session?.user?.role
                      ? t(`roles.${session.user.role}`)
                      : t('roles.PLAYER')
                    }
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 p-2">
                <div className="hover:bg-black hover:text-white p-1 transition-colors rounded-lg cursor-pointer">
                  <UserIcon className="w-6" />
                </div>
                <button
                  onClick={() => setSettingsModalOpen(!settingsModalOpen)}
                  className="hover:bg-black hover:text-white p-1 transition-colors rounded-lg cursor-pointer"
                >
                  <Cog6ToothIcon className="w-6" />
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