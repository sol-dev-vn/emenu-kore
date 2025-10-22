'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  QrCode,
  Download,
  Printer,
  Plus,
  Search,
  Filter,
  Store,
  Grid3X3,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function QRManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('');
  const [qrOptions, setQrOptions] = useState({
    includeTableNumbers: true,
    customBranding: true,
    errorCorrection: 'medium',
    size: 'medium'
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

  // Mock data
  const branches = [
    { id: '1', name: 'SOL Pizza - District 1', layouts: 3, tables: 24 },
    { id: '2', name: 'SOL Burger - Vincom Center', layouts: 2, tables: 16 },
    { id: '3', name: 'SOL Cafe - Thao Dien', layouts: 2, tables: 20 }
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
      branchName: 'SOL Pizza - District 1',
      tables: 24,
      status: 'completed',
      generatedAt: '2 hours ago',
      downloadUrl: '#',
      qrCodeCount: 24
    },
    {
      id: '2',
      layoutName: 'VIP Section',
      branchName: 'SOL Pizza - District 1',
      tables: 8,
      status: 'completed',
      generatedAt: '1 day ago',
      downloadUrl: '#',
      qrCodeCount: 8
    },
    {
      id: '3',
      layoutName: 'Outdoor Area',
      branchName: 'SOL Burger - Vincom Center',
      tables: 16,
      status: 'processing',
      generatedAt: '30 minutes ago',
      downloadUrl: null,
      qrCodeCount: 0
    }
  ];

  const availableLayouts = selectedBranch
    ? layouts.filter(layout => layout.branchId === selectedBranch)
    : [];

  const handleGenerateQR = () => {
    if (!selectedBranch || !selectedLayout) {
      alert('Please select both a branch and layout');
      return;
    }

    const selectedLayoutData = layouts.find(l => l.id === selectedLayout);
    const selectedBranchData = branches.find(b => b.id === selectedBranch);

    console.log('Generating QR codes for:', {
      branch: selectedBranchData?.name,
      layout: selectedLayoutData?.name,
      options: qrOptions,
      tables: selectedLayoutData?.tables
    });

    // Mock QR generation
    alert(`Generating ${selectedLayoutData?.tables} QR codes for ${selectedBranchData?.name} - ${selectedLayoutData?.name}`);
  };

  const handleDownload = (generationId: string, format: string) => {
    console.log(`Downloading QR codes for generation ${generationId} in ${format} format`);
    // Mock download
    alert(`Downloading QR codes as ${format.toUpperCase()}`);
  };

  const handlePrint = (generationId: string) => {
    console.log(`Printing QR codes for generation ${generationId}`);
    // Mock print
    alert('Preparing QR codes for printing (A4 format)');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Processing
        </Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'QR Codes', active: true}
        ]} />
      }
      title="QR Code Management"
      subtitle="Generate and manage QR codes for restaurant table access."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total QR Codes
              </CardTitle>
              <QrCode className="h-4 w-4" style={{color: '#9B1D20'}} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{color: '#9B1D20'}}>32</div>
              <p className="text-xs text-gray-500">Generated this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Tables
              </CardTitle>
              <Grid3X3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">48</div>
              <p className="text-xs text-gray-500">With QR codes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">156</div>
              <p className="text-xs text-gray-500">Total downloads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Branch Coverage
              </CardTitle>
              <Store className="h-4 w-4" style={{color: '#9B1D20'}} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{color: '#9B1D20'}}>100%</div>
              <p className="text-xs text-gray-500">3 branches</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generate">Generate QR Codes</TabsTrigger>
            <TabsTrigger value="history">Generation History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Set up your QR code generation parameters</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Branch Selection */}
                  <div>
                    <Label htmlFor="branch">Select Branch</Label>
                    <select
                      id="branch"
                      value={selectedBranch}
                      onChange={(e) => {
                        setSelectedBranch(e.target.value);
                        setSelectedLayout('');
                      }}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Choose a branch...</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} ({branch.tables} tables)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Layout Selection */}
                  <div>
                    <Label htmlFor="layout">Select Layout</Label>
                    <select
                      id="layout"
                      value={selectedLayout}
                      onChange={(e) => setSelectedLayout(e.target.value)}
                      disabled={!selectedBranch}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                    >
                      <option value="">Choose a layout...</option>
                      {availableLayouts.map((layout) => (
                        <option key={layout.id} value={layout.id}>
                          {layout.name} ({layout.tables} tables)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* QR Options */}
                  <div>
                    <Label>QR Code Options</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tableNumbers"
                          checked={qrOptions.includeTableNumbers}
                          onCheckedChange={(checked) =>
                            setQrOptions(prev => ({ ...prev, includeTableNumbers: checked as boolean }))
                          }
                        />
                        <Label htmlFor="tableNumbers" className="text-sm">
                          Include table numbers
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="branding"
                          checked={qrOptions.customBranding}
                          onCheckedChange={(checked) =>
                            setQrOptions(prev => ({ ...prev, customBranding: checked as boolean }))
                          }
                        />
                        <Label htmlFor="branding" className="text-sm">
                          Add custom branding
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <Label htmlFor="errorCorrection">Error Correction Level</Label>
                    <select
                      id="errorCorrection"
                      value={qrOptions.errorCorrection}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, errorCorrection: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low (7%)</option>
                      <option value="medium">Medium (15%) - Recommended</option>
                      <option value="quartile">Quartile (25%)</option>
                      <option value="high">High (30%)</option>
                    </select>
                  </div>

                  {/* QR Size */}
                  <div>
                    <Label htmlFor="size">QR Code Size</Label>
                    <select
                      id="size"
                      value={qrOptions.size}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="small">Small (150x150px)</option>
                      <option value="medium">Medium (250x250px) - Recommended</option>
                      <option value="large">Large (350x350px)</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleGenerateQR}
                    disabled={!selectedBranch || !selectedLayout}
                    className="w-full"
                    style={{backgroundColor: '#9B1D20'}}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Codes
                  </Button>
                </CardContent>
              </Card>

              {/* Preview Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <p className="text-sm text-gray-600">See how your QR codes will look</p>
                </CardHeader>
                <CardContent>
                  {selectedBranch && selectedLayout ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded-lg" style={{borderColor: '#9B1D20'}}>
                          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
                            <QrCode className="h-16 w-16 text-gray-400" />
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Table 1</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Generation Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Branch:</span>
                            <span className="font-medium">
                              {branches.find(b => b.id === selectedBranch)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Layout:</span>
                            <span className="font-medium">
                              {layouts.find(l => l.id === selectedLayout)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tables:</span>
                            <span className="font-medium">
                              {layouts.find(l => l.id === selectedLayout)?.tables}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium">
                              {qrOptions.size === 'small' ? '150x150px' :
                               qrOptions.size === 'medium' ? '250x250px' : '350x350px'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download Sample
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Sample
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a branch and layout to see preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation History</CardTitle>
                <p className="text-sm text-gray-600">View and manage your QR code generations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGenerations.map((generation) => (
                    <div key={generation.id} className="border border-gray-200 rounded-lg p-4" style={{borderColor: '#FFE4E1'}}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{generation.layoutName}</h3>
                            {getStatusBadge(generation.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{generation.branchName}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{generation.tables} tables</span>
                            <span>{generation.generatedAt}</span>
                            {generation.status === 'completed' && (
                              <span>{generation.qrCodeCount} QR codes generated</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {generation.status === 'completed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(generation.id, 'png')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                PNG
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(generation.id, 'pdf')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrint(generation.id)}
                              >
                                <Printer className="h-4 w-4 mr-1" />
                                Print
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Standard Restaurant',
                  description: 'Clean design with table numbers and logo',
                  preview: 'simple'
                },
                {
                  name: 'Modern Minimal',
                  description: 'Minimalist design with essential info only',
                  preview: 'minimal'
                },
                {
                  name: 'Brand Focused',
                  description: 'Full branding with colors and logo',
                  preview: 'branded'
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
                        <QrCode className="h-12 w-12 text-gray-400" />
                      </div>
                      <Button variant="outline" className="w-full">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HubLayout>
  );
}
