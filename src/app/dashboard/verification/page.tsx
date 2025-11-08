'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RoleAwareButton } from "@/components/dashboard/RoleAwareButton"
import { Upload, FileText, CheckCircle, MessageSquare, Briefcase } from "lucide-react"
import { PageHeader } from '@/components/page-header';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthProvider';
import { toast } from 'sonner';

function FileUploadInput({
  id,
  label,
  description,
  onSelect,
  onUpload,
  disabled,
}: {
  id: string;
  label: string;
  description: string;
  onSelect: (file: File | null) => void;
  onUpload: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="font-semibold">{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center gap-3">
        <Input
          id={id}
          type="file"
          className="flex-1"
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />
        <Button shape="pill" variant="outline" className="flex-shrink-0" onClick={onUpload} disabled={disabled}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
}

const BenefitItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
            <Icon className="h-5 w-5 text-green-500" />
        </div>
        <p className="text-sm text-muted-foreground">{text}</p>
    </div>
);


export default function VerificationPage() {
    const router = useRouter();
    const { role } = useRole();
    const [userRole, setUserRole] = useState<'buyer' | 'seller'>(role || 'buyer');
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const [busy, setBusy] = useState(false);
    const [selected, setSelected] = useState<Record<string, File | null>>({});

    // Update role when context changes
    useEffect(() => {
        setUserRole(role || 'buyer');
    }, [role]);

    const pageConfig = {
        buyer: {
            title: 'Become a Verified Buyer',
            description: 'Verifying your identity helps us keep the marketplace safe for everyone.',
            sections: [
                {
                    title: '1. Identity Document',
                    description: 'Please upload a clear, color copy of your government-issued ID (e.g., Passport, NRIC, Driver\'s License). This helps us confirm you are who you say you are.',
                    id: 'identity-document',
                    label: 'Government-issued ID',
                    fileDescription: 'Accepted formats: JPG, PNG, PDF. Max size: 5MB.'
                }
            ]
        },
        seller: {
            title: 'Become a Verified Seller',
            description: 'Complete seller verification to list your business and access all seller features.',
            sections: [
                {
                    title: '1. Business Owner Identity',
                    description: 'Upload a clear, color copy of your government-issued ID to verify your identity as the business owner.',
                    id: 'owner-identity',
                    label: 'Government-issued ID',
                    fileDescription: 'Front and back of your ID. Accepted formats: JPG, PNG, PDF. Max size: 5MB.'
                },
                {
                    title: '2. Business Registration',
                    description: 'Upload your business registration or incorporation documents to verify your business.',
                    id: 'business-registration',
                    label: 'Business Registration Document',
                    fileDescription: 'ACRA BizFile, Certificate of Incorporation, or equivalent. Max size: 10MB.'
                },
                {
                    title: '3. Proof of Business Address',
                    description: 'Upload a recent utility bill or bank statement showing your business address.',
                    id: 'business-address',
                    label: 'Proof of Business Address',
                    fileDescription: 'Must be dated within the last 3 months. Max size: 5MB.'
                },
                {
                    title: '4. Bank Account Verification',
                    description: 'For payouts, provide a voided check or bank letter showing your business bank account details.',
                    id: 'bank-verification',
                    label: 'Bank Account Verification',
                    fileDescription: 'Must show account holder name matching business name. Max size: 5MB.'
                }
            ]
        }
    };

    const docTypeMap: Record<string, 'identity' | 'business_registration' | 'business_address' | 'bank_verification' | 'proof_of_funds' | 'other'> = {
      'identity-document': 'identity',
      'owner-identity': 'identity',
      'business-registration': 'business_registration',
      'business-address': 'business_address',
      'bank-verification': 'bank_verification',
      'funds-document': 'proof_of_funds',
    };

    const uploadFor = async (sectionId: string) => {
      if (busy) return;
      const file = selected[sectionId];
      if (!file) {
        toast.error('Please choose a file first');
        return;
      }
      if (!userId) {
        toast.error('You must be logged in');
        return;
      }
      const docType = docTypeMap[sectionId] ?? 'other';
      setBusy(true);
      try {
        const path = `${userId}/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage
          .from('verification-documents')
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const res = await fetch('/api/verification/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doc_type: docType,
            storage_path: path,
            file_name: file.name,
            file_size: file.size,
          }),
        });
        if (!res.ok) {
          const msg = (await res.json().catch(() => ({}))).error || 'Failed to record document';
          throw new Error(msg);
        }
        toast.success('Document uploaded');
        // Clear file selection for this section
        setSelected((s) => ({ ...s, [sectionId]: null }));
      } catch (e: any) {
        console.error('Verification upload failed:', e);
        toast.error(e?.message || 'Upload failed');
      } finally {
        setBusy(false);
      }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title={pageConfig[userRole].title}
                description={pageConfig[userRole].description}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {pageConfig[userRole].sections.map((section, index) => (
                        <Card key={section.id} className={index > 0 ? 'mt-6' : ''}>
                            <CardHeader>
                                <CardTitle>{section.title}</CardTitle>
                                <CardDescription>
                                    {section.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploadInput 
                                  id={section.id}
                                  label={section.label}
                                  description={section.fileDescription}
                                  onSelect={(file) => setSelected((s) => ({ ...s, [section.id]: file }))}
                                  onUpload={() => uploadFor(section.id)}
                                  disabled={busy}
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Proof of Funds</CardTitle>
                            <CardDescription>
                                Provide a document that shows your financial capacity for acquisitions. This gives sellers confidence that you are a serious buyer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileUploadInput 
                              id="funds-document"
                              label="Bank Statement or Letter"
                              description="A recent bank statement or a letter from a financial institution. Accepted formats: PDF. Max size: 5MB."
                              onSelect={(file) => setSelected((s) => ({ ...s, ['funds-document']: file }))}
                              onUpload={() => uploadFor('funds-document')}
                              disabled={busy}
                            />
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <RoleAwareButton size="lg" onClick={() => {
                          const anySelected = Object.values(selected).some(Boolean);
                          if (!anySelected) {
                            toast.message('No files to submit', { description: 'Upload at least one document above.' });
                            return;
                          }
                          toast.success('Your documents have been submitted');
                          router.refresh();
                        }} disabled={busy}>
                            <FileText className="mr-2 h-4 w-4" />
                            Submit for Verification
                        </RoleAwareButton>
                    </div>
                </div>

                <aside className="lg:sticky lg:top-24 space-y-6">
                     <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>What you unlock</CardTitle>
                             <CardDescription>Verification gives you full access to the marketplace.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <BenefitItem 
                                icon={Briefcase}
                                text="Access confidential deal details (CIMs) and financials."
                           />
                           <BenefitItem 
                                icon={MessageSquare}
                                text="Directly and securely message with business owners."
                           />
                            <BenefitItem 
                                icon={CheckCircle}
                                text="Build trust with sellers and get priority access to new listings."
                           />
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    )
}
