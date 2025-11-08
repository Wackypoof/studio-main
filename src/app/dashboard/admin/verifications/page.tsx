"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type VerificationRow = {
  id: string;
  user_id: string;
  doc_type: string;
  status: string;
  storage_path: string;
  file_name?: string | null;
  file_size?: number | null;
  created_at: string;
  profiles?: { id: string; full_name?: string | null } | null;
  signed_url?: string | null;
};

export default function AdminVerificationsPage() {
  const [rows, setRows] = useState<VerificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [role, setRole] = useState<'all' | 'buyer' | 'seller'>('all');

  const docLabel = (t: string) => ({
    identity: 'Identity Document',
    business_registration: 'Business Registration',
    business_address: 'Business Address',
    bank_verification: 'Bank Verification',
    proof_of_funds: 'Proof of Funds',
    other: 'Other',
  } as Record<string, string>)[t] || t;

  const roleFromType = (t: string): 'Buyer' | 'Seller' =>
    ['business_registration', 'business_address', 'bank_verification'].includes(t) ? 'Seller' : 'Buyer';

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    params.set('status', status);
    if (role !== 'all') params.set('role', role);
    return `/api/verification/admin/list?${params.toString()}`;
  }, [role, status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(buildQuery(), { cache: "no-store" });
      if (res.status === 401) {
        toast.error("You must be logged in");
        setRows([]);
        return;
      }
      if (res.status === 403) {
        toast.error("Admins only");
        setRows([]);
        return;
      }
      const json = await res.json();
      setRows(json.verifications || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: string, status: "verified" | "rejected") => {
    setActingId(id);
    try {
      const res = await fetch("/api/verification/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))).error || "Failed";
        throw new Error(msg);
      }
      toast.success(status === "verified" ? "Verified" : "Rejected");
      await load();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Action failed");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Verification Queue" description="Review and approve/reject user verification documents." />
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <label className="text-sm text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-9 rounded-md border px-3 text-sm bg-background"
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <label className="text-sm text-muted-foreground ml-4">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="h-9 rounded-md border px-3 text-sm bg-background"
            >
              <option value="all">All</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading…</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No pending verifications</TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.profiles?.full_name || r.user_id}</TableCell>
                    <TableCell>{roleFromType(r.doc_type)}</TableCell>
                    <TableCell className="font-mono text-xs">{docLabel(r.doc_type)}</TableCell>
                    <TableCell>{r.file_name || '—'}</TableCell>
                    <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {r.signed_url ? (
                        <a className="text-blue-600 underline" href={r.signed_url} target="_blank" rel="noreferrer">Open</a>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {status === 'pending' ? (
                        <>
                          <Button shape="pill" size="sm" variant="default" onClick={() => act(r.id, "verified")} disabled={actingId === r.id}>Approve</Button>
                          <Button shape="pill" size="sm" variant="destructive" onClick={() => act(r.id, "rejected")} disabled={actingId === r.id}>Reject</Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
