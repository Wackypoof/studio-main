
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Lock, FileText } from 'lucide-react';
import Link from 'next/link';

// Mock user state
const USER_STATE = {
  isLoggedIn: false,
  isVerified: false,
  hasSignedNda: false,
};

export type NdaUserState = typeof USER_STATE;

interface NdaFormProps {
  initialState?: NdaUserState;
}

function LockedContent({ title, description, ctaText, ctaLink }: { title: string, description: string, ctaText: string, ctaLink: string }) {
  return (
    <Card className="relative overflow-hidden bg-muted/40">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4">
          <Lock className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm text-center text-muted-foreground mb-4 max-w-xs">{description}</p>
          <Button asChild>
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
        {/* Placeholder content to maintain layout */}
        <div className="space-y-4 blur-sm">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  );
}


function NdaAgreement() {
    const [agreed, setAgreed] = useState(false);
  
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sign NDA to Proceed</CardTitle>
          <CardDescription>To view seller and startup details, please sign the Non-Disclosure Agreement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-48 overflow-y-auto p-4 border rounded-md text-xs text-muted-foreground bg-muted/30">
            <p className="font-bold mb-2">NON-DISCLOSURE AGREEMENT (NDA)</p>
            <p className="mb-2">This Agreement is entered into as of {new Date().toLocaleDateString()} between the user ("Recipient") and the seller ("Disclosing Party").</p>
            <p className="mb-2">1. Confidential Information. The Disclosing Party proposes to disclose certain of its confidential and proprietary information ("Confidential Information") to the Recipient. Confidential Information shall include all data, materials, products, technology, computer programs, specifications, manuals, business plans, software, marketing plans, business plans, financial information, and other information disclosed or submitted, orally, in writing, or by any other media, to the Recipient by the Disclosing Party.</p>
            <p>2. Use of Confidential Information. Recipient agrees not to use any Confidential Information for its own use or for any purpose except to evaluate the business opportunity. Recipient shall not disclose any Confidential Information to third parties.</p>
            <p>3. Term. This Agreement shall remain in effect for a period of five (5) years from the date of disclosure.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">I have read and agree to the terms of the NDA.</Label>
          </div>
          <Button className="w-full" disabled={!agreed}>
            <FileText className="mr-2 h-4 w-4" />
            Sign NDA & View Details
          </Button>
        </CardContent>
      </Card>
    );
}

export function NdaForm({ initialState }: NdaFormProps = {}) {
  const defaultState = useMemo(() => initialState ?? USER_STATE, [initialState]);
  const [user] = useState(defaultState);

  if (!user.isLoggedIn) {
    return (
        <div className="space-y-6">
            <LockedContent 
                title="Seller Details" 
                description="Details available to verified buyers after NDA."
                ctaText="Unlock Access"
                ctaLink="/log-in"
            />
             <LockedContent 
                title="Full Business Details" 
                description="Full startup details are available after signing an NDA. Register to get started."
                ctaText="Unlock Access"
                ctaLink="/log-in"
            />
        </div>
    );
  }

  if (!user.hasSignedNda) {
    return <NdaAgreement />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Verified</CardTitle>
      </CardHeader>
      <CardContent>
        <p>You have access to the seller's details.</p>
      </CardContent>
    </Card>
  );
}
