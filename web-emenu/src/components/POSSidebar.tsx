'use client';

import { useState } from 'react';
import {
  Home,
  Utensils,
  Users,
  Coffee,
  Package,
  CreditCard,
  Settings,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Phone,
  Clock,
  CheckCircle,
  Car
} from 'lucide-react';

interface POSSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  selectedTable?: any;
}

export default function POSSidebar({ isVisible, onClose, selectedTable }: POSSidebarProps) {
  const [activeSection, setActiveSection] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('combos');

  const menuCategories = [
    { id: 'combos', name: 'Combos', icon: Package, color: 'bg-orange-100 text-orange-700' },
    { id: 'sushi', name: 'Sushi & Sashimi', icon: Utensils, color: 'bg-red-100 text-red-700' },
    { id: 'main', name: 'Main Courses', icon: Utensils, color: 'bg-blue-100 text-blue-700' },
    { id: 'drinks', name: 'Beverages', icon: Coffee, color: 'bg-green-100 text-green-700' },
    { id: 'desserts', name: 'Desserts', icon: Package, color: 'bg-pink-100 text-pink-700' }
  ];

  const menuItems = [
    { id: 1, name: 'Combo A', code: 'COMBO_A', price: 125000, category: 'combos' },
    { id: 2, name: 'Salmon Sashimi', code: 'SASHIMI_SALMON', price: 180000, category: 'sushi' },
    { id: 3, name: 'Pho Bo', code: 'PHO_BO', price: 95000, category: 'main' },
    { id: 4, name: 'Vietnamese Iced Coffee', code: 'CA_PHE_DA', price: 35000, category: 'drinks' },
    { id: 5, name: 'Cheesecake', code: 'CHEESECAKE', price: 55000, category: 'desserts' }
  ];

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Point of Sale</h2>
              {selectedTable && (
                <p className="text-sm opacity-90">Table: {selectedTable.code}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Current Order</h3>
            <span className="text-xs text-gray-500">#ORD-001</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>2 guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>12:30</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveSection('menu')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeSection === 'menu'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4 mx-auto mb-1" />
            Menu
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeSection === 'orders'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4 mx-auto mb-1" />
            Orders
          </button>
          <button
            onClick={() => setActiveSection('payment')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeSection === 'payment'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-4 h-4 mx-auto mb-1" />
            Payment
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
          {activeSection === 'menu' && (
            <div>
              {/* Categories */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex gap-2 overflow-x-auto">
                  {menuCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? category.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow text-left"
                    >
                      <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{item.code}</div>
                      <div className="text-lg font-bold text-orange-600">
                        {item.price.toLocaleString()}đ
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">Table A01</div>
                      <div className="text-xs text-gray-500">#ORD-001</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">350,000đ</div>
                      <div className="text-xs text-green-600">Completed</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    2 items • 2 guests • 12:30
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">Delivery</div>
                      <div className="text-xs text-gray-500">#DEL-002</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">450,000đ</div>
                      <div className="text-xs text-blue-600">In Progress</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    5 items • Nguyen Van A • 13:30
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Credit/Debit Card</div>
                        <div className="text-sm opacity-90">Quick and secure</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Mobile Payment</div>
                        <div className="text-sm opacity-90">MoMo, ZaloPay, etc.</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-4 text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Cash</div>
                        <div className="text-sm opacity-90">Traditional payment</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">230,000đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span className="font-medium">23,000đ</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-orange-600">253,000đ</span>
            </div>
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
            Proceed to Payment
          </button>
        </div>
      </div>
    </>
  );
}