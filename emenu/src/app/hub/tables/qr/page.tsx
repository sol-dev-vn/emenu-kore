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
import {
  QrCode,
  Download,
  Upload,
  Search,
  MapPin,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function QRCodePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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

  // Mock data
  const branches = [
    { id: '1', name: 'Miwaku Premium Landmark 81', layouts: 3, tables: 24 },
    { id: '2', name: 'S79 Teppanyaki District 1', layouts: 2, tables: 16 },
    { id: '3', name: 'S79 Teppanyaki District 7', layouts: 2, tables: 20 },
    { id: '4', name: 'Kohaku Sushi District 1', layouts: 2, tables: 14 },
    { id: '5', name: 'Kohaku Sushi Phu My Hung', layouts: 2, tables: 18 }
  ];

  const layouts = [
    { id: '1', name: 'Main Floor', branchId: '1', tables: 24 },
    { id: '2', name: 'VIP Section', branchId: '1', tables: 8 },
    { id: '3', name: 'Outdoor Area', branchId: '2', tables: 16 }
  ];

  const recentGenerations = [
    {
      id: '1',
      layoutName: 'Main Floor',
      branchName: 'Miwaku Premium Landmark 81',
      tables: 24,
      status: 'completed',
      generatedAt: '2 hours ago',
      downloadUrl: '/downloads/qr-codes/main-floor.pdf'
    },
    {
      id: '2',
      layoutName: 'VIP Section',
      branchName: 'Miwaku Premium Landmark 81',
      tables: 8,
      status: 'completed',
      generatedAt: '1 day ago',
      downloadUrl: '/downloads/qr-codes/vip-section.pdf'
    },
    {
      id: '3',
      layoutName: 'Outdoor Area',
      branchName: 'S79 Teppanyaki District 1',
      tables: 16,
      status: 'processing',
      generatedAt: '3 days ago',
      downloadUrl: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Restaurant Management', href: '/hub/branches'},
          {label: 'Table QR Codes', active: true}
        ]} />
      }
      title="Table QR Codes"
      subtitle="Generate QR codes for restaurant tables. QR codes allow customers to access the digital menu and place orders."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Generate QR Codes</CardTitle>
              <p className="text-sm text-gray-600">Create QR codes for table access</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Layout
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Choose a layout...</option>
                  {layouts.map((layout) => (
                    <option key={layout.id} value={layout.id}>
                      {layout.name} - {branches.find(b => b.id === layout.branchId)?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Include table numbers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Custom branding</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Download as PDF</span>
                  </label>
                </div>
              </div>

              <Button className="w-full" style={{backgroundColor: '#9B1D20'}}>
                <Download className="h-4 w-4 mr-2" />
                Generate QR Codes
              </Button>
            </CardContent>
          </Card>

          {/* Recent QR Code Generations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent QR Code Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGenerations.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                    <div>
                      <p className="font-medium">{item.layoutName}</p>
                      <p className="text-sm text-gray-500">{item.tables} tables • {item.branchName}</p>
                      <p className="text-xs text-gray-400">{item.generatedAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(item.status)}
                        <span className="text-xs text-gray-500">{item.status}</span>
                      </div>
                      {item.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Templates and Settings */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Templates */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Templates</CardTitle>
              <p className="text-sm text-gray-600">Pre-configured QR code styles</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Standard', description: 'Simple black and white design' },
                  { name: 'Branded', description: 'With restaurant logo and colors' },
                  { name: 'Minimal', description: 'Clean and minimal design' },
                  { name: 'Interactive', description: 'With hover effects and animations' }
                ].map((template, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg text-center cursor-pointer hover:border-brand-primary transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
                      <QrCode className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
              <p className="text-sm text-gray-600">Configure default QR code options</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Small (150x150px)</option>
                  <option selected>Medium (200x200px)</option>
                  <option>Large (300x300px)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Correction Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Low (7% error correction)</option>
                  <option selected>Medium (15% error correction)</option>
                  <option>High (25% error correction)</option>
                  <option>Highest (30% error correction)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Format
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>PNG</option>
                  <option>PDF</option>
                  <option>Svg</option>
                </select>
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </HubLayout>
  );
}