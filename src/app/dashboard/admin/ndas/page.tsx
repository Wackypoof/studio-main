"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  BarChart2,
  Check,
  Clock4,
  FileSearch,
  Filter,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RoleAwareButton } from "@/components/dashboard/RoleAwareButton";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ndaRiskCopy } from "@/lib/nda/helpers";
import { useAdminNdaRequests } from "@/hooks/useAdminNdaRequests";
import type { NdaApprovalRequestSummary, NdaRequestStatus, NdaRiskLevel } from "@/types/nda";

type FilterTab = "all" | NdaRequestStatus;

const statusLabels: Record<NdaRequestStatus, { label: string; icon: ReactNode; variant: "default" | "outline" | "secondary" | "destructive" }> = {
  pending: {
    label: "Pending",
    icon: <Clock4 className="h-3 w-3" />,
    variant: "outline",
  },
  approved: {
    label: "Approved",
    icon: <ShieldCheck className="h-3 w-3" />,
    variant: "default",
  },
  declined: {
    label: "Declined",
    icon: <ShieldAlert className="h-3 w-3" />,
    variant: "destructive",
  },
  signed: {
    label: "Signed",
    icon: <Check className="h-3 w-3" />,
    variant: "default",
  },
  expired: {
    label: "Expired",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "secondary",
  },
};

const riskStyles: Record<NdaRiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRelative = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  const now = Date.now();
  const diff = now - date.getTime();
  if (Number.isNaN(diff)) return "—";
  const minutes = Math.max(Math.round(diff / (1000 * 60)), 0);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const calculateAverageDecisionHours = (requests: NdaApprovalRequestSummary[]) => {
  const decided = requests.filter((request) => ["approved", "declined", "signed", "expired"].includes(request.status));
  if (!decided.length) return 0;
  const total = decided.reduce((acc, request) => {
    const start = new Date(request.requestedAt).getTime();
    const end = new Date(request.lastActivityAt).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return acc;
    const hours = Math.max((end - start) / (1000 * 60 * 60), 0);
    return acc + hours;
  }, 0);
  return Math.round((total / decided.length) * 10) / 10;
};

export default function AdminNdasPage() {
  const [statusFilter, setStatusFilter] = useState<FilterTab>("pending");
  const [selectedRequest, setSelectedRequest] = useState<NdaApprovalRequestSummary | null>(null);
  const [decisionTarget, setDecisionTarget] = useState<string | null>(null);

  const {
    requests,
    isLoading,
    isError,
    error,
    decide,
    isDeciding,
  } = useAdminNdaRequests({ status: "all" });

  const statusCounts = useMemo(
    () =>
      requests.reduce(
        (acc, request) => {
          acc.total += 1;
          acc[request.status] = (acc[request.status] ?? 0) + 1;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, declined: 0, signed: 0, expired: 0 } as Record<"total" | NdaRequestStatus, number>
      ),
    [requests]
  );

  const averageDecisionHours = useMemo(() => calculateAverageDecisionHours(requests), [requests]);

  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  const queueSla = useMemo(() => {
    if (!statusCounts.total) return 0;
    const resolved = statusCounts.approved + statusCounts.declined + statusCounts.signed;
    return Math.round((resolved / statusCounts.total) * 100);
  }, [statusCounts]);

  const openDialogFor = (request: NdaApprovalRequestSummary) => {
    setSelectedRequest(request);
  };

  const recordDecision = async (requestId: string, nextStatus: Extract<NdaRequestStatus, "approved" | "declined">) => {
    try {
      setDecisionTarget(requestId);
      const updated = await decide({ id: requestId, status: nextStatus });
      toast({
        title: nextStatus === "approved" ? "NDA approved" : "NDA declined",
        description:
          nextStatus === "approved"
            ? "The buyer has been notified to countersign the agreement."
            : "The buyer will receive a notice with follow-up instructions.",
      });
      setSelectedRequest((current) => (current?.id === requestId ? updated : current));
    } catch (err) {
      toast({
        title: "Failed to update request",
        description: err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setDecisionTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="NDA Approvals"
        description="Review, approve, and audit NDA access requests from buyers."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending queue</CardTitle>
            <Clock4 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{statusCounts.pending}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved this week</CardTitle>
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{statusCounts.approved}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting signature or active</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Declined</CardTitle>
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{statusCounts.declined}</p>
            <p className="text-xs text-muted-foreground mt-1">Requires follow-up notes</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. decision time</CardTitle>
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{averageDecisionHours || "–"}</p>
            <p className="text-xs text-muted-foreground mt-1">Hours to decision</p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-border/60">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterTab)} className="w-full sm:w-auto">
                <TabsList className="flex w-full flex-wrap justify-start gap-2 sm:flex-nowrap">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="declined">Declined</TabsTrigger>
                  <TabsTrigger value="signed">Signed</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Advanced filters
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[880px] text-sm">
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="min-w-[220px]">Buyer</TableHead>
                    <TableHead className="min-w-[220px]">Listing</TableHead>
                    <TableHead className="min-w-[140px]">Requested</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[100px] text-right">Risk</TableHead>
                    <TableHead className="min-w-[140px]">Last activity</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading NDA requests…</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                          <AlertCircle className="h-10 w-10" />
                          <div>
                            <p className="font-medium text-foreground">Failed to load NDA requests</p>
                            <p className="text-sm">{error?.message ?? "Please try again shortly."}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{request.buyerName}</span>
                            <span className="text-xs text-muted-foreground">{request.buyerEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{request.listingName}</span>
                            <span className="text-xs text-muted-foreground">Seller: {request.sellerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDate(request.requestedAt)}</span>
                            <span className="text-xs text-muted-foreground">{formatRelative(request.requestedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusLabels[request.status].variant} className="gap-1 text-xs">
                            {statusLabels[request.status].icon}
                            {statusLabels[request.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={`gap-1 text-xs font-medium ${riskStyles[request.riskLevel]}`}
                          >
                            {ndaRiskCopy[request.riskLevel]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDate(request.lastActivityAt)}</span>
                            <span className="text-xs text-muted-foreground">{formatRelative(request.lastActivityAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileSearch className="h-4 w-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => openDialogFor(request)}>
                                <FileSearch className="mr-2 h-4 w-4" />
                                <span>View details</span>
                              </DropdownMenuItem>
                              {request.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    disabled={isDeciding && decisionTarget === request.id}
                                    onSelect={() => void recordDecision(request.id, "approved")}
                                  >
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    <span>Approve</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    disabled={isDeciding && decisionTarget === request.id}
                                    onSelect={() => void recordDecision(request.id, "declined")}
                                  >
                                    <ThumbsDown className="mr-2 h-4 w-4" />
                                    <span>Decline</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                          <FileSearch className="h-10 w-10" />
                          <div>
                            <p className="font-medium text-foreground">No NDA requests</p>
                            <p className="text-sm">Adjust the filters or check back later.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Queue health</CardTitle>
              <CardDescription>Track processing progress against the 24h SLA.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>SLA compliance</span>
                  <span>{queueSla}%</span>
                </div>
                <Progress value={queueSla} className="mt-2 h-1.5" />
              </div>
              <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                {statusCounts.pending ? (
                  <span>{statusCounts.pending} request{statusCounts.pending === 1 ? "" : "s"} awaiting review. Prioritize medium and high risk buyers first.</span>
                ) : (
                  <span>Great work — no pending requests in the queue.</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Audit reminders</CardTitle>
              <CardDescription>Keep compliance-ready notes to avoid back-and-forth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Capture reasons when declining an NDA so the buyer success team can follow-up.</p>
              <p>• Link verification ticket IDs before approving high-risk profiles.</p>
              <p>• Export audit logs weekly for the compliance archive.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRequest.listingName}</DialogTitle>
                <DialogDescription>
                  Buyer {selectedRequest.buyerName} • Requested {formatRelative(selectedRequest.requestedAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Buyer</p>
                    <p className="mt-1 font-medium text-foreground">{selectedRequest.buyerName}</p>
                    <p className="text-xs text-muted-foreground">{selectedRequest.buyerEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Company: {selectedRequest.buyerCompany || "Independent investor"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Status</p>
                    <div className="mt-1">{statusLabels[selectedRequest.status] && (
                      <Badge variant={statusLabels[selectedRequest.status].variant} className="gap-1 text-xs">
                        {statusLabels[selectedRequest.status].icon}
                        {statusLabels[selectedRequest.status].label}
                      </Badge>
                    )}</div>
                    <p className="mt-3 text-xs uppercase text-muted-foreground">Risk level</p>
                    <Badge
                      variant="outline"
                      className={`mt-1 gap-1 text-xs font-medium ${riskStyles[selectedRequest.riskLevel]}`}
                    >
                      {ndaRiskCopy[selectedRequest.riskLevel]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase text-muted-foreground">Timeline</p>
                  <div className="space-y-3 rounded-lg border border-border/60 p-3">
                    {selectedRequest.auditTrail.map((event) => (
                      <div key={event.id} className="border-l-2 border-border/70 pl-3">
                        <p className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {event.type.replace("_", " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.createdBy}</p>
                        {event.note && <p className="text-xs text-muted-foreground mt-1">{event.note}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.status === "pending" && (
                      <>
                        <RoleAwareButton
                          size="sm"
                          disabled={isDeciding && decisionTarget === selectedRequest.id}
                          onClick={() => void recordDecision(selectedRequest.id, "approved")}
                        >
                          {isDeciding && decisionTarget === selectedRequest.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ThumbsUp className="mr-2 h-4 w-4" />
                          )}
                          Approve & notify
                        </RoleAwareButton>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isDeciding && decisionTarget === selectedRequest.id}
                          onClick={() => void recordDecision(selectedRequest.id, "declined")}
                        >
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Decline request
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: "Audit log exported",
                          description: "A CSV copy has been sent to your inbox.",
                        })
                      }
                    >
                      <FileSearch className="mr-2 h-4 w-4" />
                      Export audit log
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
