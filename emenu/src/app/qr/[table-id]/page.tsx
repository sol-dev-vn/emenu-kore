'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LoadingPage from '@/components/ui/LoadingPage';
import PageContainer from '@/components/ui/PageContainer';
import {
  Utensils,
  Clock,
  Users,
  Smartphone,
  QrCode,
  Star,
  Coffee,
  Cookie,
  Pizza,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export default function TableStatusPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tableId = params['table-id'] as string;

  const [tableData, setTableData] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    // Mock data fetch for table information
    const fetchTableData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setTableData({
          id: tableId,
          number: tableId.replace('table-', ''),
          status: 'available',
          branch: {
            name: 'SOL Pizza - District 1',
            address: '123 Nguyễn Huệ Street, District 1, Ho Chi Minh City'
          },
          layout: 'Main Floor',
          capacity: 4,
          currentOrder: null,
          waitTime: 0,
          qrCodeUrl: `/qr/${tableId}`
        });

        // Mock menu items
        setMenuItems([
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
            price: 250000,
            category: 'Pizza',
            image: '/images/menu/margherita.jpg',
            rating: 4.5,
            prepTime: '15-20 min',
            popular: true,
            dietary: ['vegetarian']
          },
          {
            id: '2',
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with parmesan cheese and croutons',
            price: 85000,
            category: 'Salads',
            image: '/images/menu/caesar.jpg',
            rating: 4.2,
            prepTime: '10 min',
            popular: false,
            dietary: ['vegetarian']
          },
          {
            id: '3',
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee-soaked ladyfingers',
            price: 95000,
            category: 'Desserts',
            image: '/images/menu/tiramisu.jpg',
            rating: 4.8,
            prepTime: '5 min',
            popular: true,
            dietary: []
          },
          {
            id: '4',
            name: 'SOL Burger',
            description: 'Signature beef burger with special sauce',
            price: 180000,
            category: 'Burgers',
            image: '/images/menu/sol-burger.jpg',
            rating: 4.6,
            prepTime: '12-15 min',
            popular: true,
            dietary: []
          }
        ]);
      } catch (error) {
        console.error('Error fetching table data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [user, isLoading, router, tableId]);

  if (isLoading || loading) {
    return <LoadingPage />;
  }

  if (!user || !tableData) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'occupied':
        return <Users className="h-4 w-4" />;
      case 'reserved':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pizza':
        return <Pizza className="h-5 w-5" />;
      case 'salads':
        return <Coffee className="h-5 w-5" />;
      case 'desserts':
        return <Cookie className="h-5 w-5" />;
      default:
        return <Utensils className="h-5 w-5" />;
    }
  };

  const handleViewMenu = () => {
    // This would typically navigate to the customer menu
    console.log('Navigate to customer menu for table:', tableId);
  };

  const handleScanQR = () => {
    // Open QR scanner or redirect to menu
    handleViewMenu();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Table {tableData.number}</h1>
                <p className="text-sm text-gray-500">{tableData.branch.name}</p>
              </div>
            </div>
            <Badge className={getStatusColor(tableData.status)}>
              {getStatusIcon(tableData.status)}
              <span className="ml-1 capitalize">{tableData.status}</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <PageContainer size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Table Info & Actions */}
          <div className="space-y-6">
            {/* Table Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" style={{color: '#9B1D20'}} />
                  Table Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Table Number</p>
                      <p className="text-lg font-semibold">{tableData.number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="text-lg font-semibold">{tableData.capacity} seats</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Layout</p>
                      <p className="text-lg font-semibold">{tableData.layout}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wait Time</p>
                      <p className="text-lg font-semibold">
                        {tableData.waitTime > 0 ? `${tableData.waitTime} min` : 'Available now'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium">{tableData.branch.name}</p>
                    <p className="text-sm text-gray-600">{tableData.branch.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleScanQR}
                  className="w-full"
                  style={{backgroundColor: '#9B1D20'}}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Scan QR Code / View Menu
                </Button>

                {tableData.status === 'available' && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => console.log('Reserve table:', tableId)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Reserve Table
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/hub')}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  Restaurant Management
                </Button>
              </CardContent>
            </Card>

            {/* Customer View */}
            <Card>
              <CardHeader>
                <CardTitle>Customer View</CardTitle>
                <p className="text-sm text-gray-600">See what customers see when scanning the QR code</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center" style={{backgroundColor: '#F5F5F5'}}>
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Customer menu interface</p>
                    <p className="text-sm text-gray-500">Mobile-optimized experience</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Preview Customer View
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Menu Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Menu Items</CardTitle>
                <p className="text-sm text-gray-600">Popular items customers can order</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex space-x-4 p-3 border border-gray-200 rounded-lg" style={{borderColor: '#FFE4E1'}}>
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" style={{backgroundColor: '#F5F5F5'}}>
                        <div className="w-full h-full flex items-center justify-center">
                          {getCategoryIcon(item.category)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{item.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-600">{item.prepTime}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold" style={{color: '#9B1D20'}}>
                              ₫{item.price.toLocaleString()}
                            </p>
                            {item.popular && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleViewMenu}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  View Full Menu
                </Button>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            <Card>
              <CardHeader>
                <CardTitle>Table QR Code</CardTitle>
                <p className="text-sm text-gray-600">QR code for table access</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Table {tableData.number}</p>
                    <p className="text-sm text-gray-600">{tableData.branch.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Scan to view menu</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </PageContainer>
      </main>
    </div>
  );
}