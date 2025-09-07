'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock, Check, AlertCircle, MoreVertical, Download, Eye, FileSignature, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type NDAStatus = 'signed' | 'pending' | 'expired' | 'declined';

interface NDA {
  id: string;
  listingId: string;
  listingName: string;
  sellerName: string;
  status: NDAStatus;
  signedDate?: string;
  expiresDate?: string;
}

// Mock data - in a real app, this would come from an API
const mockNDAs: NDA[] = [
  {
    id: 'nda-1',
    listingId: 'listing-1',
    listingName: 'Premium Skincare Dropshipping Store',
    sellerName: 'Jane Smith',
    status: 'signed',
    signedDate: '2023-10-15',
    expiresDate: '2024-10-15'
  },
  {
    id: 'nda-2',
    listingId: 'listing-2',
    listingName: 'Boutique Coffee Roastery',
    sellerName: 'John Doe',
    status: 'pending',
  },
  {
    id: 'nda-3',
    listingId: 'listing-3',
    listingName: 'AI-Powered Marketing SaaS',
    sellerName: 'Acme Inc.',
    status: 'expired',
    signedDate: '2022-05-10',
    expiresDate: '2023-05-10'
  },
];

export default function NDAsPage() {
  const getStatusBadge = (status: NDAStatus) => {
    const statusConfig = {
      signed: { label: 'Signed', variant: 'default' as const, icon: <Check className="h-3 w-3" /> },
      pending: { label: 'Pending', variant: 'outline' as const, icon: <Clock className="h-3 w-3" /> },
      expired: { label: 'Expired', variant: 'secondary' as const, icon: <AlertCircle className="h-3 w-3" /> },
      declined: { label: 'Declined', variant: 'destructive' as const, icon: <X className="h-3 w-3" /> },
    }[status];

    return (
      <Badge variant={statusConfig.variant} className="gap-1 text-xs">
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NDA Management</h1>
        <p className="text-muted-foreground">View and manage your non-disclosure agreements</p>
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search NDAs..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button>
                <FileSignature className="mr-2 h-4 w-4" />
                New NDA
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All NDAs</TabsTrigger>
              <TabsTrigger value="signed">Signed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signed Date</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockNDAs.map((nda) => (
                <TableRow key={nda.id}>
                  <TableCell className="font-medium">{nda.listingName}</TableCell>
                  <TableCell>{nda.sellerName}</TableCell>
                  <TableCell>{getStatusBadge(nda.status)}</TableCell>
                  <TableCell>{nda.signedDate || '-'}</TableCell>
                  <TableCell>{nda.expiresDate || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        {nda.status === 'pending' && (
                          <DropdownMenuItem>
                            <FileSignature className="mr-2 h-4 w-4" />
                            <span>Sign NDA</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
