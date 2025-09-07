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
    title: 'Verification Required',
    message: 'Complete your profile verification to access all features and increase trust with buyers.',
    actionText: 'Start Verification',
    variant: 'default' as const,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert h-5 w-5 text-yellow-600">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" x2="12" y1="8" y2="12"></line>
        <line x1="12" x2="12.01" y1="16" y2="16"></line>
      </svg>
    ),
    buttonVariant: 'outline' as const,
    containerClass: 'border-yellow-200 bg-yellow-50',
    titleClass: 'text-yellow-800',
    messageClass: 'text-yellow-700',
    buttonClass: 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'
  },
  pending: {
    title: 'Verification in Progress',
    message: 'Your seller verification is under review. This usually takes 1-2 business days.',
    actionText: 'Check Status',
    variant: 'default' as const,
    icon: <Clock className="h-5 w-5 text-blue-600" />,
    buttonVariant: 'outline' as const,
    containerClass: 'border-blue-100 bg-blue-50',
    titleClass: 'text-blue-800',
    messageClass: 'text-blue-700',
    buttonClass: 'border-blue-300 text-blue-700 hover:bg-blue-50'
  },
  verified: {
    title: 'Seller Verified',
    message: 'Your seller account is fully verified. You can now list your business for sale.',
    actionText: 'Create Listing',
    variant: 'default' as const,
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    buttonVariant: 'default' as const,
    containerClass: 'border-green-200 bg-green-50',
    titleClass: 'text-green-800',
    messageClass: 'text-green-700',
    buttonClass: 'bg-green-600 hover:bg-green-700 text-white'
  },
  rejected: {
    title: 'Verification Needed',
    message: 'We need additional information to verify your seller account.',
    actionText: 'Update Information',
    variant: 'destructive' as const,
    icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    buttonVariant: 'destructive' as const,
    containerClass: 'border-red-200 bg-red-50',
    titleClass: 'text-red-800',
    messageClass: 'text-red-700',
    buttonClass: 'bg-red-600 hover:bg-red-700 text-white'
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
    <div className={`rounded-xl border p-6 transition-all duration-200 hover:shadow-md hover:border-border/70 ${config.containerClass} ${className}`}>
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          {config.icon}
          <h3 className={`font-medium ${config.titleClass}`}>
            {config.title}
          </h3>
        </div>
      </div>
      <div className="pt-2">
        <p className={`text-sm mb-3 ${config.messageClass}`}>
          {message || config.message}
        </p>
        <Button
          variant={buttonVariant}
          size="sm"
          className={`${config.buttonClass} transition-colors`}
          onClick={onAction}
        >
          {actionText || config.actionText}
        </Button>
      </div>
    </div>
  );
}
