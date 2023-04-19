import { urls } from '@/const/urls';
import * as React from 'react';

import {
  BugAntIcon,
  BuildingOffice2Icon,
  HomeIcon,
  PaperClipIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export type NavItem = {
  key: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  number?: number;
};

const navigationItems: NavItem[] = [
  { key: 'home', to: urls.HOME, icon: HomeIcon },
  { key: 'challenges', to: urls.CHALLENGES, icon: RocketLaunchIcon },
  { key: 'organizations', to: urls.ORGANIZATIONS, icon: BuildingOffice2Icon },
  { key: 'drafts', to: urls.DRAFTS, icon: PaperClipIcon },
  { key: 'development', to: urls.DEVELOPMENT, icon: BugAntIcon },
];

const NavigationContext = React.createContext<NavItem[]>([]);

type NavigationProviderProps = {
  children: React.ReactNode;
};

const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const value = navigationItems;
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export { NavigationProvider, useNavigation };
