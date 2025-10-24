"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNdasPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="NDA Approvals" description="Review and manage NDA requests (coming soon)." />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            NDA approvals workflow will be added here. This will include pending requests, linked users, and approval actions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

