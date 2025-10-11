'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Phone, Mail, Search } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  last_updated: string;
}

export default function HelpDeskPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'create'>('tickets');

  const mockTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'Cannot access menu items',
      status: 'resolved',
      priority: 'high',
      category: 'System Access',
      created_at: '2025-01-10T10:30:00Z',
      last_updated: '2025-01-10T14:15:00Z'
    },
    {
      id: 'TKT-002',
      subject: 'Table QR code not working',
      status: 'in_progress',
      priority: 'medium',
      category: 'Technical Issue',
      created_at: '2025-01-10T09:15:00Z',
      last_updated: '2025-01-10T11:45:00Z'
    },
    {
      id: 'TKT-003',
      subject: 'Payment processing error',
      status: 'open',
      priority: 'urgent',
      category: 'Payment',
      created_at: '2025-01-10T08:45:00Z',
      last_updated: '2025-01-10T08:45:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (activeTab === 'create') {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Create Support Ticket</h1>
            <p className="text-gray-600 mt-2">Submit a new support request to our IT team</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('tickets')}>
            View Tickets
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Support Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <input
                type="text"
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select category</option>
                  <option value="system">System Access</option>
                  <option value="technical">Technical Issue</option>
                  <option value="payment">Payment</option>
                  <option value="menu">Menu Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority *</label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                rows={6}
                placeholder="Please provide detailed information about your issue..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('tickets')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">IT Help Desk</h1>
          <p className="text-gray-600 mt-2">Get support and track your service requests</p>
        </div>
        <Button onClick={() => setActiveTab('create')}>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Call Support</h3>
            <p className="text-sm text-gray-600 mt-1">+1 (555) 123-4567</p>
            <p className="text-xs text-gray-500">24/7 Emergency</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-sm text-gray-600 mt-1">support@sol-emu.vn</p>
            <p className="text-xs text-gray-500">Response within 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-gray-600 mt-1">Available 9am-6pm</p>
            <p className="text-xs text-gray-500">Mon-Fri</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Search className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold">Knowledge Base</h3>
            <p className="text-sm text-gray-600 mt-1">Self-help articles</p>
            <p className="text-xs text-gray-500">Available 24/7</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {ticket.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {formatDate(ticket.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Updated: {formatDate(ticket.last_updated)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {ticket.status === 'resolved' && (
                      <Button variant="outline" size="sm">
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Help Desk System Coming Soon
            </h3>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Advanced help desk features are currently under development.
              This module will include real-time chat integration, ticket tracking,
              knowledge base, and automated support workflows.
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button variant="outline" disabled>
                Live Chat Integration
              </Button>
              <Button variant="outline" disabled>
                Knowledge Base
              </Button>
              <Button variant="outline" disabled>
                SLA Management
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}