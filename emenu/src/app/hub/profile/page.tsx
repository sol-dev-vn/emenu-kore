'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Shield,
  Camera,
  Save,
  Key,
  Bell,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Asia/Ho_Chi_Minh',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

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

  const handleProfileSave = () => {
    console.log('Saving profile data:', formData);
    // Mock save
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Changing password');
    // Mock password change
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePreferencesSave = () => {
    console.log('Saving preferences:', preferences);
    // Mock save
    alert('Preferences saved successfully!');
  };

  const getRoleBadgeColor = (roleName: string) => {
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
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Profile', active: true}
        ]} />
      }
      title="User Profile"
      subtitle="Manage your account settings and preferences."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getRoleBadgeColor(user.role.name)}>
                        {user.role.name}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Member since {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button onClick={handleProfileSave} style={{backgroundColor: '#9B1D20'}}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>

                <Button onClick={handlePasswordChange} style={{backgroundColor: '#9B1D20'}}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">API Keys</p>
                      <p className="text-sm text-gray-500">Manage your API access tokens</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language and Region */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        value={preferences.timezone}
                        onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Theme */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Appearance</h3>
                  <div>
                    <Label>Theme</Label>
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                          preferences.theme === 'light' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                          preferences.theme === 'dark' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="h-4 w-4"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive browser notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={(e) => setPreferences(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                        className="h-4 w-4"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-gray-500">Get weekly summary emails</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.weeklyReports}
                        onChange={(e) => setPreferences(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                        className="h-4 w-4"
                      />
                    </label>
                  </div>
                </div>

                <Button onClick={handlePreferencesSave} style={{backgroundColor: '#9B1D20'}}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Login',
                      description: 'Logged in from Ho Chi Minh City',
                      time: '2 hours ago',
                      icon: <User className="h-4 w-4" />
                    },
                    {
                      action: 'Profile Update',
                      description: 'Updated phone number',
                      time: '1 day ago',
                      icon: <Settings className="h-4 w-4" />
                    },
                    {
                      action: 'Password Change',
                      description: 'Changed account password',
                      time: '1 week ago',
                      icon: <Key className="h-4 w-4" />
                    },
                    {
                      action: 'QR Generation',
                      description: 'Generated QR codes for Main Floor layout',
                      time: '2 weeks ago',
                      icon: <Camera className="h-4 w-4" />
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HubLayout>
  );
}
