
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Info, FileText, CheckCircle, MessageSquare, Briefcase } from "lucide-react"

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
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Become a Verified Buyer</h1>
                <p className="text-muted-foreground">Verifying your identity helps us keep the marketplace safe for everyone.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Identity Document</CardTitle>
                            <CardDescription>
                                Please upload a clear, color copy of your government-issued ID (e.g., Passport, NRIC, Driver's License). This helps us confirm you are who you say you are.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FileUploadInput 
                                id="identity-document"
                                label="Government-issued ID"
                                description="Accepted formats: JPG, PNG, PDF. Max size: 5MB."
                            />
                        </CardContent>
                    </Card>

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
