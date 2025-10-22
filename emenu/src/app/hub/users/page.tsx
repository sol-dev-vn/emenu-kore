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
import {
  Users,
  Plus,
  Search,
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
} from 'lucide-react';

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
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

  // Mock data for users
  const users = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+1 234-567-8901',
      role: 'Administrator',
      status: 'active',
      avatar: null,
      branch: 'All Branches',
      lastLogin: '2 hours ago',
      createdAt: '2024-01-15',
      permissions: ['full_access', 'user_management', 'system_settings']
    },
    {
      id: '2',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phone: '+1 234-567-8902',
      role: 'Manager',
      status: 'active',
      avatar: null,
      branch: 'Miwaku Premium Landmark 81',
      lastLogin: '1 day ago',
      createdAt: '2024-02-01',
      permissions: ['branch_management', 'staff_management', 'menu_management']
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phone: '+1 234-567-8903',
      role: 'Manager',
      status: 'active',
      avatar: null,
      branch: 'S79 Teppanyaki District 1',
      lastLogin: '3 hours ago',
      createdAt: '2024-02-15',
      permissions: ['branch_management', 'staff_management', 'menu_management']
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 234-567-8904',
      role: 'Staff',
      status: 'active',
      avatar: null,
      branch: 'Kohaku Sushi District 1',
      lastLogin: '30 minutes ago',
      createdAt: '2024-03-01',
      permissions: ['order_management', 'table_management']
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Lee',
      email: 'david.lee@example.com',
      phone: '+1 234-567-8905',
      role: 'Staff',
      status: 'inactive',
      avatar: null,
      branch: 'Kohaku Sushi Phu My Hung',
      lastLogin: '2 weeks ago',
      createdAt: '2024-03-10',
      permissions: ['order_management']
    },
    {
      id: '6',
      firstName: 'Lisa',
      lastName: 'Wang',
      email: 'lisa.wang@example.com',
      phone: '+1 234-567-8906',
      role: 'Staff',
      status: 'active',
      avatar: null,
      branch: 'Kohaku Udon District 1',
      lastLogin: '1 day ago',
      createdAt: '2024-03-15',
      permissions: ['order_management', 'table_management']
    }
  ];

  const roles = [
    { id: 'all', name: 'All Roles', count: users.length },
    { id: 'Administrator', name: 'Administrators', count: users.filter(u => u.role === 'Administrator').length },
    { id: 'Manager', name: 'Managers', count: users.filter(u => u.role === 'Manager').length },
    { id: 'Staff', name: 'Staff', count: users.filter(u => u.role === 'Staff').length }
  ];

  const statuses = [
    { id: 'all', name: 'All Status', count: users.length },
    { id: 'active', name: 'Active', count: users.filter(u => u.status === 'active').length },
    { id: 'inactive', name: 'Inactive', count: users.filter(u => u.status === 'inactive').length }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Administrator':
        return <Badge className="bg-purple-100 text-purple-800">Administrator</Badge>;
      case 'Manager':
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>;
      case 'Staff':
        return <Badge className="bg-green-100 text-green-800">Staff</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
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
        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name} ({status.count})
                  </option>
                ))}
              </select>
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50" style={{borderColor: '#FFE4E1'}}>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {user.branch}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {user.lastLogin}
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}