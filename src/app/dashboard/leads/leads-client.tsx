'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useBuyerLeads } from '@/hooks/useBuyerLeads';

interface LeadsClientProps {
  searchParams: { listing?: string };
}

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

export function LeadsClient({ searchParams }: LeadsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'lastContactedAt', direction: 'desc' });
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const { data, isLoading, error, refetch } = useBuyerLeads({
    listingId: searchParams.listing,
  });

  const leads = useMemo(() => data?.leads ?? [], [data?.leads]);
  const statusCounts = data?.statusCounts ?? {};
  const totalLeads = data?.count ?? leads.length;
  
  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const matchesSearch = 
          (lead.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.company ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (lead.listingName ?? '').toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesStatus = activeTab === 'all' || lead.status === activeTab;
        const matchesListing = !searchParams.listing || lead.listingId === searchParams.listing;
        
        return matchesSearch && matchesStatus && matchesListing;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'lastContactedAt') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.lastContactedAt ?? 0).getTime() - new Date(b.lastContactedAt ?? 0).getTime()
            : new Date(b.lastContactedAt ?? 0).getTime() - new Date(a.lastContactedAt ?? 0).getTime();
        }
        return 0;
      });
  }, [leads, searchTerm, activeTab, searchParams.listing, sortConfig]);

  const showEmptyState = !isLoading && !error && filteredLeads.length === 0;
  
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
    return statusCounts[status] || 0;
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
          <RoleAwareButton>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Lead
          </RoleAwareButton>
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
            <div className="text-2xl font-bold">{totalLeads}</div>
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
              {getStatusCount('contacted')}
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
              {((statusCounts['closed_won'] || 0) / (totalLeads || 1) * 100).toFixed(1)}%
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
                All <span className="ml-1 text-muted-foreground">({totalLeads})</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="text-xs sm:text-sm">
                New <span className="ml-1 text-muted-foreground">({getStatusCount('new')})</span>
              </TabsTrigger>
              <TabsTrigger value="contacted" className="text-xs sm:text-sm">
                Contacted <span className="ml-1 text-muted-foreground">({getStatusCount('contacted')})</span>
              </TabsTrigger>
              <TabsTrigger value="qualified" className="text-xs sm:text-sm">
                Qualified <span className="ml-1 text-muted-foreground">({getStatusCount('qualified')})</span>
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
        
        {error && (
          <div className="px-4 py-3">
            <Alert variant="destructive">
              <AlertTitle>Unable to load leads</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred while fetching leads.'}
              </AlertDescription>
              <div className="mt-3">
                <Button size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </Alert>
          </div>
        )}

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
                  onClick={() => handleSort('lastContactedAt')}
                >
                  <div className="flex items-center">
                    Last Contact
                    {sortConfig.key === 'lastContactedAt' && (
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
              {error ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">
                    Unable to load leads. Please try again.
                  </td>
                </tr>
              ) : isLoading ? (
                [...Array(4)].map((_, index) => (
                  <tr key={`lead-skeleton-${index}`} className="animate-pulse">
                    <td className="p-3">
                      <Skeleton className="h-4 w-4 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3 text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : showEmptyState ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <p className="font-medium">No leads found matching your criteria</p>
                      <p className="text-sm mt-1">Try adjusting filters or add a new lead.</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setActiveTab('all'); }}>
                        Reset filters
                      </Button>
                      <RoleAwareButton size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Lead
                      </RoleAwareButton>
                    </div>
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
                          <AvatarImage src={lead.buyerAvatar ?? undefined} alt={lead.name ?? 'Buyer'} />
                          <AvatarFallback>
                            {(lead.name ?? 'Buyer')
                              .split(' ')
                              .filter(Boolean)
                              .map(part => part[0]?.toUpperCase())
                              .join('')
                              .slice(0, 2) || 'B'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name ?? 'Buyer'}</div>
                          <div className="text-sm text-muted-foreground">{lead.company ?? '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusConfig[lead.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
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
                    <td className="p-3 text-sm">{lead.listingName ?? '—'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {lead.lastContactedAt
                        ? new Date(lead.lastContactedAt).toLocaleDateString()
                        : '—'}
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
                            <UserIcon className="mr-2 h-4 w-4" />
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
                            <span>View Details</span>
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
      </Card>
      
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <span className="text-sm text-muted-foreground">
            {selectedLeads.length} selected
          </span>
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
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
