'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, 
  Settings, 
  Users, 
  FileText, 
  Home, 
  Menu, 
  Search,
  Bell,
  User,
  Store,
  Utensils
} from 'lucide-react';

export default function HubPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        icon: Home,
        href: '/hub',
        description: 'Overview and statistics',
      },
    ];

    const roleBasedItems = [];

    // Add items based on user role
    if (user.role.name === 'Administrator' || user.role.name === 'Manager') {
      roleBasedItems.push(
        {
          title: 'Restaurants',
          icon: Store,
          href: '/hub/restaurants',
          description: 'Manage restaurant locations',
        },
        {
          title: 'Menu Management',
          icon: Utensils,
          href: '/hub/menus',
          description: 'Manage menu items and categories',
        },
        {
          title: 'Staff',
          icon: Users,
          href: '/hub/staff',
          description: 'Manage staff accounts and permissions',
        }
      );
    }

    if (user.role.name === 'Administrator') {
      roleBasedItems.push(
        {
          title: 'Reports',
          icon: FileText,
          href: '/hub/reports',
          description: 'View system reports and analytics',
        },
        {
          title: 'Settings',
          icon: Settings,
          href: '/hub/settings',
          description: 'System configuration and settings',
        }
      );
    }

    // Staff-specific items
    if (user.role.name === 'Staff') {
      roleBasedItems.push(
        {
          title: 'My Restaurant',
          icon: Store,
          href: `/hub/restaurant/${user.id}`,
          description: 'Manage your assigned restaurant',
        },
        {
          title: 'Menu Updates',
          icon: Utensils,
          href: '/hub/menu-updates',
          description: 'Update menu items and prices',
        }
      );
    }

    return [...baseItems, ...roleBasedItems];
  };

  const navigationItems = getNavigationItems();

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Administrator':
        return 'bg-red-100 text-red-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Staff':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <img
                className="h-8 w-auto mr-4"
                src="/images/logo.svg"
                alt="SOL.com.vn"
              />
              <h1 className="text-xl font-semibold text-gray-900">SOL Staff Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.first_name} />
                  <AvatarFallback>
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your restaurants today.
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Profile</CardTitle>
              <Badge className={getRoleBadgeColor(user.role.name)}>
                {user.role.name}
              </Badge>
            </div>
            <CardDescription>
              Manage your account settings and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.first_name} />
                <AvatarFallback className="text-lg">
                  {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-500">{user.email}</p>
                {user.title && (
                  <p className="text-sm text-gray-500">{user.title}</p>
                )}
                {user.location && (
                  <p className="text-sm text-gray-500">{user.location}</p>
                )}
              </div>
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => (
            <Card key={item.href} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <item.icon className="h-5 w-5 mr-2 text-primary" />
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(item.href)}
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">30+</p>
              <p className="text-sm text-gray-500">Across Vietnam</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-gray-500">Currently available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">200+</p>
              <p className="text-sm text-gray-500">Active employees</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}