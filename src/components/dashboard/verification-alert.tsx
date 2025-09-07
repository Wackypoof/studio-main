import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

type AlertVariant = 'default' | 'destructive';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

interface VerificationAlertProps {
  className?: string;
  variant?: AlertVariant;
  status?: VerificationStatus;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const statusConfig = {
  unverified: {
    title: 'Seller Verification Required',
    message: 'Complete seller verification to list your business and access all seller features.',
    actionText: 'Start Verification',
    variant: 'destructive' as const,
    icon: <ShieldAlert className="h-4 w-4" />,
    buttonVariant: 'destructive' as const
  },
  pending: {
    title: 'Verification in Progress',
    message: 'Your seller verification is under review. This usually takes 1-2 business days.',
    actionText: 'Check Status',
    variant: 'default' as const,
    icon: <Clock className="h-4 w-4" />,
    buttonVariant: 'outline' as const
  },
  verified: {
    title: 'Seller Verified',
    message: 'Your seller account is fully verified. You can now list your business for sale.',
    actionText: 'Create Listing',
    variant: 'default' as const,
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    buttonVariant: 'default' as const
  },
  rejected: {
    title: 'Verification Needed',
    message: 'We need additional information to verify your seller account.',
    actionText: 'Update Information',
    variant: 'destructive' as const,
    icon: <AlertCircle className="h-4 w-4" />,
    buttonVariant: 'destructive' as const
  }
};

export function VerificationAlert({ 
  className = '',
  status = 'unverified',
  message,
  actionText,
  onAction,
  variant: propVariant
}: VerificationAlertProps) {
  const config = statusConfig[status];
  const variant = propVariant || config.variant;
  const buttonVariant = config.buttonVariant;
  
  return (
    <Alert variant={variant} className={className}>
      {config.icon}
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="flex-grow">
          {message || config.message}
        </span>
        <Button 
          asChild 
          variant={buttonVariant} 
          size="sm" 
          className="whitespace-nowrap"
          onClick={onAction}
        >
          <Link href="/my-dashboard/verification">
            {actionText || config.actionText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
