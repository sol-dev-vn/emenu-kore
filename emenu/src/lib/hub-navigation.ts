import {
  Home,
  Utensils,
  Store,
  Layout,
  QrCode,
  Settings,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  icon: any;
  href: string;
  description?: string;
  badge?: string;
  children?: SidebarItem[];
}

/**
 * Get navigation items based on user role
 */
export function getNavigationItems(userRole: string, t: (key: string) => string): SidebarItem[] {
  const baseItems: SidebarItem[] = [
    {
      title: t('navigation.dashboard'),
      icon: Home,
      href: '/hub',
      description: t('dashboard.subtitle')
    },
  ];

  const roleBasedItems: SidebarItem[] = [];

  if (userRole === 'Administrator' || userRole === 'Manager') {
    roleBasedItems.push(
      {
        title: t('navigation.menuManagement'),
        icon: Utensils,
        href: '/hub/menus',
        description: t('menu.subtitle')
      },
      {
        title: t('navigation.branchManagement'),
        icon: Store,
        href: '/hub/branches',
        description: t('branches.subtitle'),
        badge: 'New'
      },
      {
        title: t('navigation.tableLayouts'),
        icon: Layout,
        href: '/hub/layouts',
        description: t('tableLayouts.subtitle')
      },
      {
        title: t('navigation.qrCodes'),
        icon: QrCode,
        href: '/hub/qr',
        description: t('qrCodes.subtitle')
      }
    );
  }

  if (userRole === 'Administrator') {
    roleBasedItems.push(
      {
        title: t('navigation.settings'),
        icon: Settings,
        href: '/hub/settings',
        description: t('settings.subtitle')
      }
    );
  }

  // Staff-specific items
  if (userRole === 'Staff') {
    roleBasedItems.push(
      {
        title: 'My Restaurant',
        icon: Store,
        href: `/hub/restaurant/user`, // This would need to be dynamic based on user ID
        description: 'Manage your assigned restaurant'
      }
    );
  }

  return [...baseItems, ...roleBasedItems];
}

/**
 * Get role badge color class
 */
export function getRoleBadgeColor(roleName: string): string {
  switch (roleName) {
    case 'Administrator':
      return 'bg-red-600 text-white';
    case 'Manager':
      return 'bg-blue-600 text-white';
    case 'Staff':
      return 'bg-green-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}