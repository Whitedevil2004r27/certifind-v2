'use client';
import { Mail, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = () => {
    // In a real app we would call supabase.auth.resend({ type: 'signup', email: userEmail })
    setSent(true);
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-10 h-10 text-emerald-400" />
        </div>
        
        <h2 className="text-3xl font-black text-white">Check your inbox</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
          We've sent a verification link to your email address. 
          Please click the link to activate your account.
        </p>

        {sent && (
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            Verification email resent!
          </div>
        )}

        <div className="pt-6 border-t border-white/5 space-y-4">
          <p className="text-white/30 text-xs">Didn't receive an email?</p>
          <button 
            onClick={handleResend}
            disabled={!canResend}
            className="w-full py-3 rounded-xl font-bold text-sm text-white/70 border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${!canResend && 'animate-spin-slow'}`} />
            {canResend ? 'Resend verification link' : `Resend in ${countdown}s`}
          </button>
          
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:text-white" style={{ color: '#7226FF' }}>
            Back to login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
