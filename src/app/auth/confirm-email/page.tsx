'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get email from URL params or localStorage if available
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('emailForSignIn', emailParam);
    } else {
      const savedEmail = localStorage.getItem('emailForSignIn');
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setMessage('');
    
    try {
      // Resend the confirmation email using Supabase
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          redirectTo: `${window.location.origin}/auth/callback`
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend confirmation email');
      }
      
      setMessage('Confirmation email resent successfully! Please check your inbox.');
    } catch (error: any) {
      console.error('Error resending email:', error);
      setMessage(error.message || 'Failed to resend confirmation email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a confirmation link to {email || 'your email'}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Check your email</h3>
            <p className="mt-1 text-sm text-gray-500">
              We've sent a confirmation link to {email || 'your email address'}. Click the link to
              confirm your account and get started.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending || !email}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend confirmation email'}
              </button>
            </div>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Already confirmed your email?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
