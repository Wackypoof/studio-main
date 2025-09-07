import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

type AlertVariant = 'default' | 'destructive';

interface VerificationAlertProps {
  className?: string;
  variant?: AlertVariant;
}

export function VerificationAlert({ 
  className = '',
  variant = 'destructive'
}: VerificationAlertProps) {
  return (
    <Alert variant={variant} className={className}>
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Action Required: Verify Your Account</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="flex-grow">
          You need to verify your identity to access full listing details and contact sellers.
        </span>
        <Button asChild variant={variant} size="sm" className="whitespace-nowrap">
          <Link href="/my-dashboard/verification">
            Start Verification <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
