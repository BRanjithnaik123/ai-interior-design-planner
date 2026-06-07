'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { requestPasswordReset, resetPassword } from '@/lib/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // For requesting reset
  const [email, setEmail] = useState('');
  
  // For resetting with token
  const [newPassword, setNewPassword] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await requestPasswordReset(email);
      setSuccessMessage(res.message || 'If an account exists, a reset link has been sent.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await resetPassword(token, newPassword);
      setSuccessMessage('Password reset successfully. You can now log in.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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

        <Card glass className="p-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <h1 className="text-2xl font-bold mb-2">
            {token ? 'Reset your password' : 'Forgot password'}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">
            {token 
              ? 'Enter your new password below.'
              : 'Enter your email address and we will send you a link to reset your password.'}
          </p>

          {error && (
            <div className="p-3 mb-6 rounded bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-6 rounded bg-green-500/10 border border-green-500/50 text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {!token ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button type="submit" fullWidth isLoading={loading} className="mt-6">
                Send reset link
              </Button>
            </form>
          ) : (
            successMessage ? (
              <Link href="/login" className="block w-full mt-6">
                <Button fullWidth type="button">
                  Go to login
                </Button>
              </Link>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Button type="submit" fullWidth isLoading={loading} className="mt-6">
                  Reset password
                </Button>
              </form>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
