'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <h2 className="text-3xl font-black text-white">Account Ready</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
          Email verification is not required for this deployment. You can continue directly to your dashboard after signing in.
        </p>

        <div className="pt-6 border-t border-white/5">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:text-white" style={{ color: '#7226FF' }}>
            Continue to dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
