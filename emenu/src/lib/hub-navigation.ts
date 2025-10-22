import {
  Home,
  Utensils,
  Store,
  Layout,
  QrCode,
  Settings,
  ChevronRight,
  Building,
  MapPin,
  Package,
  Users,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  icon: any;
  href: string;
  description?: string;
  badge?: string;
  children?: SidebarItem[];
  isSectionHeader?: boolean;
}

/**
 * Get navigation items based on user role
 */
export function getNavigationItems(userRole: string, t: (key: string) => string): SidebarItem[] {
  const baseItems: SidebarItem[] = [
    {
      title: 'Overview',
      icon: Home,
      href: '/hub',
      description: 'Dashboard and system overview'
    },
  ];

  const roleBasedItems: SidebarItem[] = [];

  if (userRole === 'Administrator' || userRole === 'Manager') {
    roleBasedItems.push(
      {
        title: 'Brands',
        icon: Building,
        href: '#brands',
        description: 'Manage brands and their menus',
        isSectionHeader: true,
        children: [
          {
            title: 'Brands',
            icon: Building,
            href: '/hub/brands',
            description: 'Brand management and configuration'
          },
          {
            title: 'Brand Menu',
            icon: Utensils,
            href: '/hub/brands/menu',
            description: 'Master menu management for brands'
          }
        ]
      },
      {
        title: 'Restaurants',
        icon: Store,
        href: '#restaurants',
        description: 'Manage restaurant locations and operations',
        isSectionHeader: true,
        children: [
          {
            title: 'Locations',
            icon: MapPin,
            href: '/hub/branches',
            description: 'Restaurant branch management',
            badge: 'New'
          },
          {
            title: 'Restaurant Menu',
            icon: Utensils,
            href: '/hub/branches/menu',
            description: 'Branch-specific menu configuration'
          },
          {
            title: 'Table Layout',
            icon: Layout,
            href: '/hub/tables',
            description: 'Table layout and arrangement'
          },
          {
            title: 'Table QR Codes',
            icon: QrCode,
            href: '/hub/tables/qr',
            description: 'Generate and manage QR codes'
          },
          {
            title: 'Manager & Staff',
            icon: Users,
            href: '/hub/users',
            description: 'User management and permissions'
          }
        ]
      }
    );
  }

  if (userRole === 'Administrator') {
    roleBasedItems.push(
      {
        title: 'System',
        icon: Settings,
        href: '#system',
        description: 'System configuration and settings',
        isSectionHeader: true,
        children: [
          {
            title: 'General',
            icon: Settings,
            href: '/hub/settings',
            description: 'General system settings'
          }
        ]
      }
    );
  }

  // Staff-specific items
  if (userRole === 'Staff') {
    roleBasedItems.push(
      {
        title: 'Restaurant Management',
        icon: Store,
        href: '#restaurant-management',
        description: 'Manage restaurant operations',
        isSectionHeader: true,
        children: [
          {
            title: 'My Restaurant',
            icon: Store,
            href: `/hub/restaurant/user`, // This would need to be dynamic based on user ID
            description: 'Manage your assigned restaurant'
          }
        ]
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