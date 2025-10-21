'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  Shield,
  Bell,
  Globe,
  CreditCard
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  status: 'active' | 'inactive' | 'maintenance';
  tables_count: number;
  opening_hours?: string;
  manager?: {
    name: string;
    email: string;
    phone?: string;
  };
  brand: {
    id: string;
    name: string;
    logo?: string;
  };
  created_at: string;
}

interface BranchSettingsProps {
  branch: Branch;
}

export function BranchSettings({ branch }: BranchSettingsProps) {
  const [settings, setSettings] = useState({
    // Basic Info
    name: branch.name,
    address: branch.address,
    phone: branch.phone || '',
    status: branch.status,

    // Operating Hours
    openingHours: branch.opening_hours || '',
    lunchHours: '11:00 - 14:00',
    dinnerHours: '17:00 - 22:00',
    weekendHours: '10:00 - 23:00',

    // Contact
    managerName: branch.manager?.name || '',
    managerEmail: branch.manager?.email || '',
    managerPhone: branch.manager?.phone || '',

    // Features
    onlineOrdering: true,
    tableReservations: true,
    deliveryService: false,
    cateringService: false,
    wifiAvailable: true,
    parkingAvailable: true,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyReports: true,

    // Payment
    cashAccepted: true,
    cardAccepted: true,
    mobilePayments: true,
    vouchersAccepted: true,

    // Localization
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    language: 'vi-VN'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Branch Settings</span>
          </CardTitle>
          <p className="text-gray-600">
            Configure branch information, operating hours, and features
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Branch Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={settings.status}
                    onChange={(e) => setSettings({...settings, status: e.target.value as any})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="tables">Number of Tables</Label>
                  <Input
                    id="tables"
                    type="number"
                    value={branch.tables_count}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Manager Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="managerName">Manager Name</Label>
                  <Input
                    id="managerName"
                    value={settings.managerName}
                    onChange={(e) => setSettings({...settings, managerName: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="managerEmail">Manager Email</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    value={settings.managerEmail}
                    onChange={(e) => setSettings({...settings, managerEmail: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="managerPhone">Manager Phone</Label>
                <Input
                  id="managerPhone"
                  value={settings.managerPhone}
                  onChange={(e) => setSettings({...settings, managerPhone: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Operating Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openingHours">General Hours</Label>
                <Input
                  id="openingHours"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({...settings, openingHours: e.target.value})}
                  placeholder="e.g., 10:00 - 22:00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lunchHours">Lunch Service</Label>
                  <Input
                    id="lunchHours"
                    value={settings.lunchHours}
                    onChange={(e) => setSettings({...settings, lunchHours: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="dinnerHours">Dinner Service</Label>
                  <Input
                    id="dinnerHours"
                    value={settings.dinnerHours}
                    onChange={(e) => setSettings({...settings, dinnerHours: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weekendHours">Weekend Hours</Label>
                <Input
                  id="weekendHours"
                  value={settings.weekendHours}
                  onChange={(e) => setSettings({...settings, weekendHours: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Branch Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="onlineOrdering">Online Ordering</Label>
                    <p className="text-sm text-gray-500">Allow customers to order online</p>
                  </div>
                  <Switch
                    id="onlineOrdering"
                    checked={settings.onlineOrdering}
                    onCheckedChange={(checked) => setSettings({...settings, onlineOrdering: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tableReservations">Table Reservations</Label>
                    <p className="text-sm text-gray-500">Enable table booking system</p>
                  </div>
                  <Switch
                    id="tableReservations"
                    checked={settings.tableReservations}
                    onCheckedChange={(checked) => setSettings({...settings, tableReservations: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deliveryService">Delivery Service</Label>
                    <p className="text-sm text-gray-500">Offer food delivery</p>
                  </div>
                  <Switch
                    id="deliveryService"
                    checked={settings.deliveryService}
                    onCheckedChange={(checked) => setSettings({...settings, deliveryService: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cateringService">Catering Service</Label>
                    <p className="text-sm text-gray-500">Provide catering options</p>
                  </div>
                  <Switch
                    id="cateringService"
                    checked={settings.cateringService}
                    onCheckedChange={(checked) => setSettings({...settings, cateringService: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="wifiAvailable">WiFi Available</Label>
                    <p className="text-sm text-gray-500">Free WiFi for customers</p>
                  </div>
                  <Switch
                    id="wifiAvailable"
                    checked={settings.wifiAvailable}
                    onCheckedChange={(checked) => setSettings({...settings, wifiAvailable: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="parkingAvailable">Parking Available</Label>
                    <p className="text-sm text-gray-500">Customer parking spaces</p>
                  </div>
                  <Switch
                    id="parkingAvailable"
                    checked={settings.parkingAvailable}
                    onCheckedChange={(checked) => setSettings({...settings, parkingAvailable: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email updates</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive text message alerts</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Mobile app notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dailyReports">Daily Reports</Label>
                    <p className="text-sm text-gray-500">Receive daily business reports</p>
                  </div>
                  <Switch
                    id="dailyReports"
                    checked={settings.dailyReports}
                    onCheckedChange={(checked) => setSettings({...settings, dailyReports: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cashAccepted">Cash Payments</Label>
                    <p className="text-sm text-gray-500">Accept cash payments</p>
                  </div>
                  <Switch
                    id="cashAccepted"
                    checked={settings.cashAccepted}
                    onCheckedChange={(checked) => setSettings({...settings, cashAccepted: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cardAccepted">Card Payments</Label>
                    <p className="text-sm text-gray-500">Accept credit/debit cards</p>
                  </div>
                  <Switch
                    id="cardAccepted"
                    checked={settings.cardAccepted}
                    onCheckedChange={(checked) => setSettings({...settings, cardAccepted: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mobilePayments">Mobile Payments</Label>
                    <p className="text-sm text-gray-500">Accept mobile wallet payments</p>
                  </div>
                  <Switch
                    id="mobilePayments"
                    checked={settings.mobilePayments}
                    onCheckedChange={(checked) => setSettings({...settings, mobilePayments: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="vouchersAccepted">Vouchers/Gift Cards</Label>
                    <p className="text-sm text-gray-500">Accept vouchers and gift cards</p>
                  </div>
                  <Switch
                    id="vouchersAccepted"
                    checked={settings.vouchersAccepted}
                    onCheckedChange={(checked) => setSettings({...settings, vouchersAccepted: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          style={{backgroundColor: '#9B1D20'}}
          className="text-white hover:bg-red-700"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}