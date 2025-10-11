'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Settings, Shield, Clock, Mail, Phone } from 'lucide-react';

export default function StaffManagementPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage team members, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Import
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Staff Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">All Active</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-purple-600">System Admins</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-orange-600">Department Leads</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff</p>
                <p className="text-2xl font-bold">16</p>
                <p className="text-xs text-green-600">Service Staff</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sample Staff Members */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">JD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-gray-600">Restaurant Manager</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Admin</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Permissions</Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">SJ</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-gray-600">Head Chef</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Manager</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Permissions</Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">MC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Mike Chen</h3>
                    <p className="text-sm text-gray-600">Waiter</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Staff</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Permissions</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Staff Management Module Coming Soon
            </h3>
            <p className="text-purple-700 max-w-2xl mx-auto">
              Comprehensive staff management features are currently under development.
              This module will include employee profiles, role management,
              scheduling, attendance tracking, and performance metrics.
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button variant="outline" disabled>
                Schedule Management
              </Button>
              <Button variant="outline" disabled>
                Performance Reviews
              </Button>
              <Button variant="outline" disabled>
                Payroll Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}