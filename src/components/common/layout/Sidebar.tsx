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
import { classNames } from '@/const';
import { useTranslation } from 'next-i18next';

type NavigationItem = {
  key: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

type NavigationItemProps = {
  item: NavigationItem;
  active: boolean;
};

const navigationItems: NavigationItem[] = [
  { key: "home", to: "/", icon: HomeIcon },
  { key: "development", to: "/dev", icon: BugAntIcon },
  { key: "challenges", to: "/challenges", icon: RocketLaunchIcon },
  { key: "organizations", to: "/organizations", icon: BuildingOffice2Icon },
  { key: "drafts", to: "/drafts", icon: PaperClipIcon },
];

const NavigationItem = ({ item, active }: NavigationItemProps) => {
  const { t } = useTranslation('navigation');

  return (
    <Link
      href={item.to}
      key={item.key}
      className={classNames(
        "flex items-center justify-start gap-2 px-3 py-2 rounded-lg transition-colors duration-200",
        active ? "bg-black text-white" : "bg-white hover:bg-neutral-100 text-black"
      )}
    >
      <item.icon className="w-6" />
      {t(`sidebar.items.${item.key}`)}
    </Link>
  );
};

const SidebarNavigation = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 p-2">
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.key}
          item={item}
          active={router.pathname === item.to}
        />
      ))}
    </div>
  );
};

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center gap-6 p-2 pt-4">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <h1 className="text-5xl font-bold uppercase">Terra</h1>
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <nav className="bg-white w-72 h-screen fixed shadow-md px-1">
      <div className="flex flex-col justify-between h-full divide-y-2 divide-gray-200">
        <div className="flex flex-col gap-4 divide-y-2 divide-gray-200">
          <Logo />
          <SidebarNavigation />
        </div>
        <div className="p-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-left gap-2">
              <div className="border border-neutral-700 p-0.5 rounded-lg overflow-hidden bg-purple-500">
                <Image src="/logo.png" alt="logo" width={36} height={36} />
              </div>
              <div className="flex flex-col items-start justify-center text-sm">
                <span className="font-bold">John Doe</span>
                <span className="text-neutral-700">Administrator</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 p-2">
              <div className="hover:bg-black hover:text-white p-1 transition-colors rounded-lg cursor-pointer">
                <UserIcon className="w-6" />
              </div>
              <div className="hover:bg-black hover:text-white p-1 transition-colors rounded-lg cursor-pointer">
                <Cog6ToothIcon className="w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};