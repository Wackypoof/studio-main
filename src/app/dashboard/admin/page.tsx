"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleAwareButton } from "@/components/dashboard/RoleAwareButton";

export default function AdminHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin" description="Manage approvals and reviews across the platform." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Review identity and business verification documents submitted by buyers and sellers.</p>
            <RoleAwareButton asChild>
              <Link href="/dashboard/admin/verifications">Open Queue</Link>
            </RoleAwareButton>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NDA Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Approve or reject NDA requests from buyers for confidential listing access.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/ndas">View NDAs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
