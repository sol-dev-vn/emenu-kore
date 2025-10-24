'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUsers } from '@/hooks/use-users';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  UserCheck,
  UserX,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { users, loading, error, refetch } = useUsers();
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter users based on role and status
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role.name === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesRole && matchesStatus;
  });

  // Calculate role counts
  const roles = [
    { id: 'all', name: 'All Roles', count: users.length },
    { id: 'Administrator', name: 'Administrators', count: users.filter(u => u.role.name === 'Administrator').length },
    { id: 'Manager', name: 'Managers', count: users.filter(u => u.role.name === 'Manager').length },
    { id: 'Staff', name: 'Staff', count: users.filter(u => u.role.name === 'Staff').length }
  ];

  // Calculate status counts
  const statuses = [
    { id: 'all', name: 'All Status', count: users.length },
    { id: 'active', name: 'Active', count: users.filter(u => u.status === 'active').length },
    { id: 'inactive', name: 'Inactive', count: users.filter(u => u.status === 'inactive').length }
  ];

  // Format last access date
  const formatLastAccess = (lastAccess?: string) => {
    if (!lastAccess) return 'Never';
    const date = new Date(lastAccess);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <UserCheck className="h-3 w-3" />
          Active
        </Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <UserX className="h-3 w-3" />
          Inactive
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: { name: string }) => {
    switch (role.name) {
      case 'Administrator':
        return <Badge className="bg-purple-100 text-purple-800">Administrator</Badge>;
      case 'Manager':
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>;
      case 'Staff':
        return <Badge className="bg-green-100 text-green-800">Staff</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role.name}</Badge>;
    }
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Restaurant Management', href: '/hub/branches'},
          {label: 'Manager & Staff', active: true}
        ]} />
      }
      title="Manager & Staff"
      subtitle="Manage restaurant staff and user permissions."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with error and loading states */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={loading}
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={loading}
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name} ({status.count})
                  </option>
                ))}
              </select>

              <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <Button style={{backgroundColor: '#9B1D20'}}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Managers</p>
                    <p className="text-2xl font-bold">{users.filter(u => u.role === 'Manager').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <UserX className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                    <p className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{borderColor: '#FFE4E1'}}>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Branch</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                          <p className="text-gray-500">Loading users...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <p className="text-gray-500">No users found matching the current filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50" style={{borderColor: '#FFE4E1'}}>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                              <AvatarFallback>
                                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </p>
                              {user.phone_number && (
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phone_number}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            {user.branch || 'Not assigned'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatLastAccess(user.last_access)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}