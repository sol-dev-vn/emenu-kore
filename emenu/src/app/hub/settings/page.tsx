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
  Settings,
  Store,
  Users,
  Globe,
  Database,
  Bell,
  Shield,
  Mail,
  Smartphone,
  CreditCard,
  FileText,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'SOL Restaurant Management',
    siteUrl: 'https://sol-menu.alphabits.team',
    adminEmail: 'admin@sol.com.vn',
    defaultCurrency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    maintenanceMode: false,
    debugMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFrom: 'noreply@sol.com.vn',
    emailFromName: 'SOL Restaurant'
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    lastBackup: '2024-01-20 02:00:00',
    nextBackup: '2024-01-21 02:00:00'
  });

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

  if (user.role.name !== 'Administrator') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access system settings.</p>
            <Button
              onClick={() => router.push('/hub')}
              className="mt-4"
              style={{backgroundColor: '#9B1D20'}}
            >
              Back to Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSystemSave = () => {
    console.log('Saving system settings:', systemSettings);
    alert('System settings saved successfully!');
  };

  const handleEmailSave = () => {
    console.log('Saving email settings:', emailSettings);
    alert('Email settings saved successfully!');
  };

  const handleBackup = () => {
    console.log('Creating backup...');
    alert('Backup initiated successfully!');
  };

  const handleRestore = () => {
    console.log('Restoring from backup...');
    alert('Restore functionality would be implemented here');
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Settings', active: true}
        ]} />
      }
      title="System Settings"
      subtitle="Configure system-wide settings and preferences."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Site Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Site Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      type="url"
                      value={systemSettings.siteUrl}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={systemSettings.adminEmail}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <select
                      id="defaultCurrency"
                      value={systemSettings.defaultCurrency}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="VND">Vietnamese Dong (VND)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={systemSettings.timezone}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Bangkok">Asia/Bangkok</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">Temporarily disable public access</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Debug Mode</p>
                      <p className="text-sm text-gray-500">Enable detailed error logging</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.debugMode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, debugMode: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </label>
                </div>

                <Button onClick={handleSystemSave} style={{backgroundColor: '#9B1D20'}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application</p>
                      <p className="text-xs text-gray-500">Running normally</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Database</p>
                      <p className="text-xs text-gray-500">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Storage</p>
                      <p className="text-xs text-gray-500">78% free</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emailFrom">From Email</Label>
                    <Input
                      id="emailFrom"
                      type="email"
                      value={emailSettings.emailFrom}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, emailFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input
                      id="emailFromName"
                      value={emailSettings.emailFromName}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, emailFromName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleEmailSave} style={{backgroundColor: '#9B1D20'}}>
                    <Mail className="h-4 w-4 mr-2" />
                    Save Email Settings
                  </Button>
                  <Button variant="outline">
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Backup</p>
                      <p className="text-sm text-gray-500">Enable scheduled backups</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={backupSettings.autoBackup}
                      onChange={(e) => setBackupSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </label>

                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <select
                      id="backupFrequency"
                      value={backupSettings.backupFrequency}
                      onChange={(e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="backupRetention">Retention Period (days)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={backupSettings.backupRetention}
                      onChange={(e) => setBackupSettings(prev => ({ ...prev, backupRetention: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div>
                      <p className="font-medium">Last Backup</p>
                      <p className="text-sm text-gray-500">{backupSettings.lastBackup}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div>
                      <p className="font-medium">Next Scheduled Backup</p>
                      <p className="text-sm text-gray-500">{backupSettings.nextBackup}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Scheduled
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleBackup} style={{backgroundColor: '#9B1D20'}}>
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup Now
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore from Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-gray-500">Users are logged out after 24 hours</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div>
                      <p className="font-medium">Password Policy</p>
                      <p className="text-sm text-gray-500">Minimum 8 characters with special chars</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div>
                      <p className="font-medium">API Rate Limiting</p>
                      <p className="text-sm text-gray-500">100 requests per minute per user</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Payment Gateway</p>
                        <p className="text-sm text-gray-500">Configure payment processing</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Google Analytics</p>
                        <p className="text-sm text-gray-500">Track website usage</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Send SMS alerts</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      level: 'error',
                      message: 'Database connection failed',
                      time: '2024-01-20 14:30:25',
                      details: 'Connection timeout after 30 seconds'
                    },
                    {
                      level: 'warning',
                      message: 'High memory usage detected',
                      time: '2024-01-20 13:15:42',
                      details: 'Memory usage at 85%'
                    },
                    {
                      level: 'info',
                      message: 'User login: admin@sol.com.vn',
                      time: '2024-01-20 12:00:00',
                      details: 'Successful authentication'
                    }
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                      <div className="flex-shrink-0">
                        {log.level === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        {log.level === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        {log.level === 'info' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{log.message}</p>
                        <p className="text-sm text-gray-600">{log.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.time}</p>
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