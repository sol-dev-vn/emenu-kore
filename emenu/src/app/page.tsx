'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Smartphone,
  Camera,
  Utensils,
  MapPin,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [detectedTable, setDetectedTable] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to hub if user is already logged in
    if (!isLoading && user) {
      router.push('/hub');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  const handleScanQR = () => {
    setScanning(true);

    // Mock QR code scanning - in a real implementation, this would use the device camera
    setTimeout(() => {
      const mockTables = ['table-1', 'table-2', 'table-3', 'table-4', 'table-5'];
      const randomTable = mockTables[Math.floor(Math.random() * mockTables.length)];
      setDetectedTable(randomTable);
      setScanning(false);
    }, 3000);
  };

  const handleViewTable = (tableId: string) => {
    router.push(`/qr/${tableId}`);
  };

  const featuredItems = [
    {
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella',
      price: 250000,
      rating: 4.5,
      image: '/images/menu/margherita.jpg'
    },
    {
      name: 'SOL Burger',
      description: 'Signature beef burger with special sauce',
      price: 180000,
      rating: 4.6,
      image: '/images/menu/sol-burger.jpg'
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee',
      price: 95000,
      rating: 4.8,
      image: '/images/menu/tiramisu.jpg'
    }
  ];

  const branches = [
    {
      name: 'SOL Pizza - District 1',
      address: '123 Nguyễn Huệ Street, District 1',
      distance: '0.5 km',
      rating: 4.7,
      open: true
    },
    {
      name: 'SOL Burger - Vincom Center',
      address: '72 Lê Thánh Tôn Street, District 1',
      distance: '1.2 km',
      rating: 4.5,
      open: true
    },
    {
      name: 'SOL Cafe - Thao Dien',
      address: '45 Xuan Thuy Street, District 2',
      distance: '2.8 km',
      rating: 4.6,
      open: false
    }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFE4E1'}}>
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to
              <span className="block" style={{color: '#9B1D20'}}> SOL Restaurant</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600">
              Experience authentic Italian cuisine with a modern twist. Scan QR codes for instant menu access and ordering.
            </p>

            <div className="mt-8 flex justify-center space-x-4">
              <Button
                onClick={handleScanQR}
                disabled={scanning}
                className="px-8 py-3"
                style={{backgroundColor: '#9B1D20'}}
              >
                {scanning ? (
                  <>
                    <Camera className="h-5 w-5 mr-2 animate-pulse" />
                    Scanning QR Code...
                  </>
                ) : (
                  <>
                    <QrCode className="h-5 w-5 mr-2" />
                    Scan QR Code
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/login')}
                className="px-8 py-3"
              >
                Staff Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* QR Detection Result */}
      {detectedTable && (
        <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-800">QR Code Detected!</h3>
                    <p className="text-green-600">Table {detectedTable.replace('table-', '')} is ready for your order</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewTable(detectedTable)}
                  style={{backgroundColor: '#9B1D20'}}
                >
                  View Table
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Smart Dining Experience</h2>
            <p className="mt-4 text-lg text-gray-600">Scan, order, and enjoy with our modern restaurant technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8" style={{color: '#9B1D20'}} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Ordering</h3>
              <p className="text-gray-600">Scan table QR codes for instant menu access and contactless ordering</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8" style={{color: '#9B1D20'}} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Optimized mobile experience for seamless browsing and ordering</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8" style={{color: '#9B1D20'}} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Live menu updates and order status tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Dishes</h2>
            <p className="mt-4 text-lg text-gray-600">Discover our most popular menu items</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" style={{backgroundColor: '#F5F5F5'}}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                    <p className="text-xl font-bold" style={{color: '#9B1D20'}}>
                      ₫{item.price.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Locations</h2>
            <p className="mt-4 text-lg text-gray-600">Find us near you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{branch.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{branch.address}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{branch.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{branch.distance}</span>
                        </div>
                        <Badge className={branch.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {branch.open ? 'Open' : 'Closed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Smart Dining?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Visit any of our locations and scan the QR code on your table to get started
          </p>
          <Button
            onClick={handleScanQR}
            className="px-8 py-3"
            style={{backgroundColor: '#9B1D20'}}
          >
            <QrCode className="h-5 w-5 mr-2" />
            Try QR Code Scanning
          </Button>
        </div>
      </section>
    </div>
  );
}