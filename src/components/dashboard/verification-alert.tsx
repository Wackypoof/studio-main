import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { ShieldAlert, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

interface VerificationAlertProps {
  className?: string;
  status?: VerificationStatus;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: ButtonProps['variant'];
}

interface StatusConfig {
  title: string;
  message: string;
  actionText: string;
  icon: ReactNode;
  containerClass: string;
  titleClass: string;
  messageClass: string;
  buttonClass: string;
  buttonVariant: ButtonProps['variant'];
}

const statusConfig: Record<VerificationStatus, StatusConfig> = {
  unverified: {
    title: 'Verification Required',
    message: 'Complete your profile verification to access all features and increase trust with buyers.',
    actionText: 'Start Verification',
    icon: <ShieldAlert className="h-5 w-5 text-yellow-600" />,
    containerClass: 'border-yellow-200 bg-yellow-50',
    titleClass: 'text-yellow-800',
    messageClass: 'text-yellow-700',
    buttonClass: 'border-yellow-300 text-yellow-700 hover:bg-yellow-100',
    buttonVariant: 'outline',
  },
  pending: {
    title: 'Verification in Progress',
    message: 'Your seller verification is under review. This usually takes 1-2 business days.',
    actionText: 'Check Status',
    icon: <Clock className="h-5 w-5 text-blue-600" />,
    containerClass: 'border-blue-100 bg-blue-50',
    titleClass: 'text-blue-800',
    messageClass: 'text-blue-700',
    buttonClass: 'border-blue-300 text-blue-700 hover:bg-blue-50',
    buttonVariant: 'outline',
  },
  verified: {
    title: 'Seller Verified',
    message: 'Your seller account is fully verified. You can now list your business for sale.',
    actionText: 'Create Listing',
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    containerClass: 'border-green-200 bg-green-50',
    titleClass: 'text-green-800',
    messageClass: 'text-green-700',
    buttonClass: 'bg-green-600 text-white hover:bg-green-700',
    buttonVariant: 'default',
  },
  rejected: {
    title: 'Verification Needed',
    message: 'We need additional information to verify your seller account.',
    actionText: 'Update Information',
    icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    containerClass: 'border-red-200 bg-red-50',
    titleClass: 'text-red-800',
    messageClass: 'text-red-700',
    buttonClass: 'text-white',
    buttonVariant: 'destructive',
  },
};

export function VerificationAlert({
  className,
  status = 'unverified',
  message,
  actionText,
  onAction,
  variant,
}: VerificationAlertProps) {
  const config = statusConfig[status];
  const buttonVariant = variant ?? config.buttonVariant;

  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all duration-200 hover:border-border/70 hover:shadow-md',
        config.containerClass,
        className,
      )}
      role="status"
      aria-live="polite"
      data-status={status}
    >
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          {config.icon}
          <h3 className={cn('font-medium', config.titleClass)}>{config.title}</h3>
        </div>
      </div>
      <div className="pt-2">
        <p className={cn('mb-3 text-sm', config.messageClass)}>{message ?? config.message}</p>
        <Button
          variant={buttonVariant}
          size="sm"
          className={cn('transition-colors', config.buttonClass)}
          onClick={onAction}
        >
          {actionText ?? config.actionText}
        </Button>
      </div>
    </div>
  );
}
