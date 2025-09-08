'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Info, FileText, CheckCircle, MessageSquare, Briefcase } from "lucide-react"
import { PageHeader } from '@/components/page-header';

function FileUploadInput({ id, label, description }: { id: string, label: string, description: string }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id} className="font-semibold">{label}</Label>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center gap-3">
                <Input id={id} type="file" className="flex-1" />
                 <Button variant="outline" className="flex-shrink-0">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                </Button>
            </div>
        </div>
    )
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

    return (
        <div className="space-y-8">
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
                            />
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button size="lg">
                            <FileText className="mr-2 h-4 w-4" />
                            Submit for Verification
                        </Button>
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
