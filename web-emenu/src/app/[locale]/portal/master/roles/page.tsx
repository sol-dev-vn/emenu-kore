'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Key, Eye, Edit, Trash, Settings, Lock } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Permissions & Roles</h1>
          <p className="text-gray-600 mt-2">Manage user roles and access permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Roles
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-blue-600">System Roles</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-purple-600">User-defined</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">Available</p>
              </div>
              <Key className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Roles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Super Admin</h3>
                    <p className="text-sm text-gray-600">Full system access and control</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">System</span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">All Permissions</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Restaurant Manager</h3>
                    <p className="text-sm text-gray-600">Branch management and operations</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">System</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">18 Permissions</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Staff</h3>
                    <p className="text-sm text-gray-600">Basic operations access</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">System</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">8 Permissions</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Settings className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kitchen Manager</h3>
                    <p className="text-sm text-gray-600">Kitchen operations and menu management</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Custom</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">12 Permissions</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-1" />
                    Permissions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Permissions Module Coming Soon
            </h3>
            <p className="text-red-700 max-w-2xl mx-auto">
              Advanced permission management features are currently under development.
              This module will include granular permissions, role-based access control,
              custom role creation, and audit logging.
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button variant="outline" disabled>
                Permission Matrix
              </Button>
              <Button variant="outline" disabled>
                Access Logs
              </Button>
              <Button variant="outline" disabled>
                Role Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}