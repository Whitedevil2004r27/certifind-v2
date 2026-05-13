'use client';

import { ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto">
          <KeyRound className="w-10 h-10 text-amber-400" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white mb-2">Reset Link Not Active</h2>
          <p className="text-white/45 text-sm leading-relaxed">
            This deployment does not currently issue password reset links. Use your current credentials or contact support for account recovery.
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
          <Link
            href="/support"
            className="w-full py-3 rounded-xl font-black text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #7226FF, #160078)', boxShadow: '0 0 20px rgba(114,38,255,0.4)' }}
          >
            Contact Support
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
