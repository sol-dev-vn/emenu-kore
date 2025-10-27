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
  TrendingUp,
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
    {
      title: 'Live Dashboard',
      icon: TrendingUp,
      href: '/hub/live',
      description: 'Real-time branch monitoring'
    },
  ];

  return baseItems;
}

/**
 * Get role badge color class
 */
export function getRoleBadgeColor(roleName: string): string {
  switch (roleName) {
    case 'Administrator':
      return 'bg-brand-primary text-white';
    case 'Manager':
      return 'bg-blue-600 text-white';
    case 'Staff':
      return 'bg-green-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}