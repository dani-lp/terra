import type { NavItem } from '@/components/common/layout/context/NavigationContext';
import { adminUrls, orgUrls, playerUrls } from '@/const/urls';
import type { Role } from '@prisma/client';

export const filterNavigationItems = (navigationItems: NavItem[], role?: Role) => {
  if (!role) {
    return [];
  }

  const roleUrls: Record<Role, Record<string, string>> = {
    ADMIN: adminUrls,
    ORGANIZATION: orgUrls,
    PLAYER: playerUrls,
  } as const;

  return navigationItems.filter((item) => {
    return Object.values(roleUrls[role]).some((url) => url === item.to);
  });
};
