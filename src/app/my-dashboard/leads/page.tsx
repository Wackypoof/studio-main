'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Mail, Phone, MessageSquare, Calendar, MapPin, Briefcase, 
  ChevronDown, ChevronUp, MoreVertical, Mail as MailIcon, Phone as PhoneIcon, 
  MessageSquare as MessageIcon, FileText, Check, X, Clock, Star, UserPlus, Download,
  Users, TrendingUp, User as UserIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockData } from '@/lib/data';
import type { User } from '@/lib/types';

import { PageHeader } from '@/components/page-header';

// Mock data for leads
const generateLeads = (count = 10) => {
  const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];
  const sources = ['website', 'referral', 'social_media', 'email', 'phone'];
  const interests = ['Dental Clinic', 'Tuition Center', 'Fashion Boutique', 'Cafe', 'Manufacturing'];
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const interest = interests[Math.floor(Math.random() * interests.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const lastContact = new Date();
    lastContact.setDate(lastContact.getDate() - daysAgo);
    
    return {
      id: `lead_${i + 1}`,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      phone: `+65 ${Math.floor(80000000 + Math.random() * 20000000)}`,
      company: `Company ${String.fromCharCode(65 + i)}`,
      position: ['CEO', 'Founder', 'Director', 'Manager', 'Investor'][Math.floor(Math.random() * 5)],
      status,
      source,
      interest,
      lastContact: lastContact.toISOString(),
      notes: `Interested in ${interest}. ${['Very interested', 'Mildly interested', 'Just browsing'][Math.floor(Math.random() * 3)]}.`,
      budget: Math.floor(Math.random() * 2000000) + 500000,
      timeline: ['ASAP', '1-3 months', '3-6 months', '6-12 months', '1+ year'][Math.floor(Math.random() * 5)],
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
    };
  });
};

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contacted', color: 'bg-purple-100 text-purple-800' },
  qualified: { label: 'Qualified', color: 'bg-green-100 text-green-800' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-yellow-100 text-yellow-800' },
  negotiation: { label: 'In Negotiation', color: 'bg-indigo-100 text-indigo-800' },
  closed_won: { label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  closed_lost: { label: 'Closed Lost', color: 'bg-gray-100 text-gray-800' },
};

const sourceConfig = {
  website: { label: 'Website', icon: <Briefcase className="h-3 w-3" /> },
  referral: { label: 'Referral', icon: <UserIcon className="h-3 w-3" /> },
  social_media: { label: 'Social Media', icon: <MessageSquare className="h-3 w-3" /> },
  email: { label: 'Email', icon: <Mail className="h-3 w-3" /> },
  phone: { label: 'Phone', icon: <Phone className="h-3 w-3" /> },
};

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'lastContact', direction: 'desc' });
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Generate mock leads
  const leads = Array.from({ length: 15 }, (_, index) => {
    const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Avery'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    
    return {
      id: `lead_${index + 1}`,
      name,
      email,
      phone: `+65 ${80000000 + Math.floor(Math.random() * 20000000)}`,
      company: `Company ${String.fromCharCode(65 + index)}`,
      position: ['CEO', 'Founder', 'Director', 'Manager', 'Investor'][Math.floor(Math.random() * 5)],
      status: ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'][Math.floor(Math.random() * 7)],
      source: ['website', 'referral', 'social_media', 'email', 'phone'][Math.floor(Math.random() * 5)],
      interest: ['Dental Clinic', 'Tuition Center', 'Fashion Boutique', 'Cafe', 'Manufacturing'][Math.floor(Math.random() * 5)],
      lastContact: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    };
  });

  // Define a type for our lead
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  source: string;
  interest: string;
  lastContact: string;
}

// Lead details for the first lead
const leadDetails = (leads[0] || {}) as Partial<Lead>;

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesStatus = activeTab === 'all' || lead.status === activeTab;
        const matchesListing = !listingId || lead.interest === listingId;
        
        return matchesSearch && matchesStatus && matchesListing;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'lastContact') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime()
            : new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
        }
        // Add more sort options as needed
        return 0;
      });
  }, [leads, searchTerm, activeTab, listingId, sortConfig]);
  
  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };
  
  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };
  
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const getStatusCount = (status: string) => {
    const newLeadsCount = leads.filter(lead => lead.status === 'new').length;
    return newLeadsCount;
  };
  
  // Status counts for stats
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const user: User = {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    avatarUrl: '',
    isVerifiedBuyer: true
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buyer Leads"
        description="Manage and track your potential buyers"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </PageHeader>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getStatusCount('new')}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts['contacted']}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5.7%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((statusCounts['closed_won'] || 0) / (leads.length || 1) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b">
          <Tabs 
            defaultValue="all" 
            className="w-full sm:w-auto"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4 sm:flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All <span className="ml-1 text-muted-foreground">({leads.length})</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="text-xs sm:text-sm">
                New <span className="ml-1 text-muted-foreground">({getStatusCount('new')})</span>
              </TabsTrigger>
              <TabsTrigger value="contacted" className="text-xs sm:text-sm">
                Contacted <span className="ml-1 text-muted-foreground">({statusCounts['contacted']})</span>
              </TabsTrigger>
              <TabsTrigger value="qualified" className="text-xs sm:text-sm">
                Qualified <span className="ml-1 text-muted-foreground">({statusCounts['qualified']})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="w-12 p-3">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th 
                  className="p-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Lead
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Source</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Interested In</th>
                <th 
                  className="p-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort('lastContact')}
                >
                  <div className="flex items-center">
                    Last Contact
                    {sortConfig.key === 'lastContact' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="p-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50">
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${lead.id}`} alt={lead.name} />
                          <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[lead.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig[lead.status as keyof typeof statusConfig]?.label || lead.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <span className="mr-1">
                          {sourceConfig[lead.source as keyof typeof sourceConfig]?.icon}
                        </span>
                        {sourceConfig[lead.source as keyof typeof sourceConfig]?.label || lead.source}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{lead.interest}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(lead.lastContact).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MailIcon className="mr-2 h-4 w-4" />
                            <span>Send Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PhoneIcon className="mr-2 h-4 w-4" />
                            <span>Call</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View History</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageIcon className="mr-2 h-4 w-4" />
                            <span>Send Message</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredLeads.length > 0 && (
          <div className="border-t px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedLeads.length} of {filteredLeads.length} row{filteredLeads.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled={selectedLeads.length === 0}>
                <MailIcon className="mr-2 h-4 w-4" />
                Email Selected
              </Button>
              <Button variant="outline" size="sm" disabled={selectedLeads.length === 0}>
                <MessageIcon className="mr-2 h-4 w-4" />
                Message Selected
              </Button>
              <Button variant="outline" size="sm" disabled={selectedLeads.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Lead Activity */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Lead Activity</CardTitle>
            <CardDescription>Latest interactions with your leads</CardDescription>
          </CardHeader>
          <CardContent>
            {[
              { 
                id: 1, 
                lead: { name: 'John Doe', company: 'ABC Corp' }, 
                type: 'email', 
                action: 'sent', 
                details: 'Follow-up email about pricing',
                time: '2 hours ago'
              },
              { 
                id: 2, 
                lead: { name: 'Sarah Smith', company: 'XYZ Ltd' }, 
                type: 'call', 
                action: 'received', 
                details: 'Discussed business requirements',
                time: '5 hours ago'
              },
              { 
                id: 3, 
                lead: { name: 'Michael Chen', company: '123 Industries' }, 
                type: 'meeting', 
                action: 'scheduled', 
                details: 'Site visit scheduled for next week',
                time: '1 day ago'
              },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start py-3 border-b last:border-0">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5">
                  {activity.type === 'email' ? (
                    <MailIcon className="h-5 w-5 text-muted-foreground" />
                  ) : activity.type === 'call' ? (
                    <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {activity.lead.name} <span className="text-muted-foreground font-normal">({activity.lead.company})</span>
                    </p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm">
                    <span className="capitalize">{activity.action}</span> {activity.type}: {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                leads.reduce((acc, lead) => {
                  acc[lead.source] = (acc[lead.source] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([source, count]) => {
                const percentage = Math.round((count / leads.length) * 100);
                const sourceInfo = sourceConfig[source as keyof typeof sourceConfig] || { label: source };
                
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">{sourceInfo.icon}</span>
                        <span className="text-sm font-medium">{sourceInfo.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <MailIcon className="mr-2 h-4 w-4" />
                  Email All
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <MessageIcon className="mr-2 h-4 w-4" />
                  Message All
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
