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
import {
  Layout,
  Plus,
  Search,
  Edit,
  Eye,
  Grid3X3,
  Square,
  Circle,
  Triangle,
  Download,
  Upload,
  MapPin
} from 'lucide-react';

export default function TableLayoutsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

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

  // Mock data for branches and layouts
  const branches = [
    { id: 'all', name: 'All Branches', layouts: 15 },
    { id: '1', name: 'Miwaku Premium Landmark 81', layouts: 3 },
    { id: '2', name: 'S79 Teppanyaki District 1', layouts: 2 },
    { id: '3', name: 'S79 Teppanyaki District 7', layouts: 2 },
    { id: '4', name: 'Kohaku Sashimi District 1', layouts: 2 },
    { id: '5', name: 'Kohaku Sashimi Thao Dien', layouts: 2 },
    { id: '6', name: 'Kohaku Sushi District 1', layouts: 2 },
    { id: '7', name: 'Kohaku Sushi Phu My Hung', layouts: 2 },
    { id: '8', name: 'Kohaku Udon District 1', layouts: 2 },
    { id: '9', name: 'Date Nariya District 1', layouts: 2 },
    { id: '10', name: 'Date Nariya Thao Dien', layouts: 1 },
    { id: '11', name: 'Machida Shoten District 1', layouts: 1 }
  ];

  const layouts = [
    {
      id: '1',
      name: 'Main Floor',
      branch: 'Miwaku Premium Landmark 81',
      branchId: '1',
      tables: 24,
      status: 'active',
      lastModified: '2 hours ago',
      modifiedBy: 'John Smith',
      zones: 3,
      shapeTypes: ['square', 'rectangle']
    },
    {
      id: '2',
      name: 'VIP Section',
      branch: 'Miwaku Premium Landmark 81',
      branchId: '1',
      tables: 8,
      status: 'active',
      lastModified: '1 day ago',
      modifiedBy: 'Emily Davis',
      zones: 1,
      shapeTypes: ['circle', 'square']
    },
    {
      id: '3',
      name: 'Outdoor Terrace',
      branch: 'S79 Teppanyaki District 1',
      branchId: '2',
      tables: 16,
      status: 'draft',
      lastModified: '3 days ago',
      modifiedBy: 'Michael Chen',
      zones: 2,
      shapeTypes: ['rectangle', 'circle']
    },
    {
      id: '4',
      name: 'Teppanyaki Stations',
      branch: 'S79 Teppanyaki District 1',
      branchId: '2',
      tables: 12,
      status: 'active',
      lastModified: '5 hours ago',
      modifiedBy: 'Sarah Johnson',
      zones: 2,
      shapeTypes: ['square', 'rectangle']
    },
    {
      id: '5',
      name: 'Sushi Bar',
      branch: 'Kohaku Sushi District 1',
      branchId: '4',
      tables: 20,
      status: 'active',
      lastModified: '1 week ago',
      modifiedBy: 'David Lee',
      zones: 1,
      shapeTypes: ['rectangle', 'square']
    },
    {
      id: '6',
      name: 'Private Dining Room',
      branch: 'Kohaku Sushi District 1',
      branchId: '4',
      tables: 4,
      status: 'active',
      lastModified: '2 weeks ago',
      modifiedBy: 'Lisa Wang',
      zones: 1,
      shapeTypes: ['circle', 'square']
    }
  ];

  const filteredLayouts = layouts.filter(layout => {
    const matchesSearch = layout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layout.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || layout.branchId === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case 'square':
        return <Square className="h-4 w-4" />;
      case 'circle':
        return <Circle className="h-4 w-4" />;
      case 'triangle':
        return <Triangle className="h-4 w-4" />;
      default:
        return <Grid3X3 className="h-4 w-4" />;
    }
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Restaurant Management', href: '/hub/branches'},
          {label: 'Table Layout', active: true}
        ]} />
      }
      title="Table Layouts"
      subtitle="Configure and manage table layouts for restaurant branches."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content */}
        <Tabs defaultValue="layouts" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="layouts">Layouts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search layouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <Button style={{backgroundColor: '#9B1D20'}} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Layout
              </Button>
            </div>
          </div>

          <TabsContent value="layouts" className="space-y-6">
            {/* Layouts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLayouts.map((layout) => (
                <Card key={layout.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{layout.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{layout.branch}</p>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(layout.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Tables</p>
                          <p className="font-medium">{layout.tables}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Zones</p>
                          <p className="font-medium">{layout.zones}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm mb-2">Table Shapes</p>
                        <div className="flex space-x-2">
                          {layout.shapeTypes.map((shape, index) => (
                            <div
                              key={index}
                              className="p-2 border border-gray-200 rounded flex items-center"
                              style={{borderColor: '#FFE4E1'}}
                            >
                              {getShapeIcon(shape)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        <p>Modified by {layout.modifiedBy}</p>
                        <p>{layout.lastModified}</p>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Small Restaurant',
                  description: 'Ideal for restaurants with 10-20 tables',
                  tables: 16,
                  zones: 2,
                  layout: 'compact'
                },
                {
                  name: 'Large Restaurant',
                  description: 'Perfect for restaurants with 30+ tables',
                  tables: 36,
                  zones: 4,
                  layout: 'spacious'
                },
                {
                  name: 'Cafe Style',
                  description: 'Flexible layout for casual dining',
                  tables: 24,
                  zones: 3,
                  layout: 'casual'
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Tables</p>
                          <p className="font-medium">{template.tables}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Zones</p>
                          <p className="font-medium">{template.zones}</p>
                        </div>
                      </div>

                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
                        <Layout className="h-8 w-8 text-gray-400" />
                      </div>

                      <Button className="w-full" variant="outline">
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