'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Search, ChevronDown, ChevronUp, Smartphone, CreditCard, User, Settings, FileText, AlertTriangle, MessageSquare, Mail } from 'lucide-react';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'Getting Started',
      question: 'How do I scan a QR code to access the menu?',
      answer: 'Simply open your smartphone camera and point it at the QR code on your table. A notification will appear asking you to open the link. Tap it to access our digital menu.',
      tags: ['QR Code', 'Mobile', 'Menu']
    },
    {
      id: '2',
      category: 'Getting Started',
      question: 'Do I need to download an app?',
      answer: 'No, you don\'t need to download any app. Our system works directly through your web browser. Just scan the QR code and you\'ll be taken to our online menu.',
      tags: ['App', 'Browser', 'Mobile']
    },
    {
      id: '3',
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, credit/debit cards, mobile payments, and various digital wallets including Apple Pay and Google Pay.',
      tags: ['Payment', 'Methods', 'Cards']
    },
    {
      id: '4',
      category: 'Payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment processing is secured with industry-standard encryption. We never store your payment details on our servers.',
      tags: ['Security', 'Payment', 'Privacy']
    },
    {
      id: '5',
      category: 'Menu & Ordering',
      question: 'How do I place an order?',
      answer: 'Browse our menu categories, select items you\'d like to order, specify quantity and any special requests, then proceed to checkout to complete your order.',
      tags: ['Ordering', 'Menu', 'Process']
    },
    {
      id: '6',
      category: 'Menu & Ordering',
      question: 'Can I modify my order after placing it?',
      answer: 'You can modify your order within 2 minutes of placing it. After that, please speak with our staff who will assist you with any changes.',
      tags: ['Ordering', 'Modifications', 'Staff']
    },
    {
      id: '7',
      category: 'Technical Issues',
      question: 'What if the QR code doesn\'t work?',
      answer: 'Please inform our staff immediately. They can provide you with an alternative way to access the menu or assist you with technical issues.',
      tags: ['QR Code', 'Technical', 'Support']
    },
    {
      id: '8',
      category: 'Technical Issues',
      question: 'The page is loading slowly, what should I do?',
      answer: 'Try refreshing your browser or checking your internet connection. If issues persist, our staff can assist you with placing your order manually.',
      tags: ['Performance', 'Browser', 'Connection']
    }
  ];

  const categories = ['all', 'Getting Started', 'Payment', 'Menu & Ordering', 'Technical Issues'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started': return <Smartphone className="h-4 w-4" />;
      case 'Payment': return <CreditCard className="h-4 w-4" />;
      case 'Menu & Ordering': return <FileText className="h-4 w-4" />;
      case 'Technical Issues': return <AlertTriangle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-2">Find answers to common questions about SOL eMenu</p>
        </div>
        <Button variant="outline">
          <HelpCircle className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="bg-gray-50 rounded-lg p-6">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No FAQs Found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse different categories.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-6">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{faq.question}</h3>
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {faq.category}
                      </span>
                      {faq.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {expandedItems.includes(faq.id) && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Additional Help */}
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <HelpCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Still Need Help?
            </h3>
            <p className="text-green-700 max-w-2xl mx-auto mb-4">
              Can't find what you're looking for? Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex gap-2 justify-center">
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}