'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { verifyEmail } from '@/lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Optional: wait a moment then redirect to dashboard or login
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (err: unknown) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--primary)]/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[var(--accent)]" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
              DesignAI
            </span>
          </Link>
        </div>

        <Card glass className="p-8 text-center flex flex-col items-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-[var(--primary-light)] animate-spin mb-6" />
              <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
              <p className="text-[var(--text-secondary)]">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
              <h1 className="text-2xl font-bold mb-2">Email Verified</h1>
              <p className="text-[var(--text-secondary)] mb-8">{message}</p>
              <p className="text-sm text-gray-400 mb-6">Redirecting to dashboard...</p>
              <Link href="/dashboard" className="block w-full">
                <Button fullWidth type="button">
                  Go to Dashboard
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-6" />
              <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
              <p className="text-[var(--text-secondary)] mb-8">{message}</p>
              <Link href="/login" className="block w-full">
                <Button fullWidth variant="outline" type="button">
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
