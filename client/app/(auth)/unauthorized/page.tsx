'use client';
import { ShieldAlert, Home } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

export default function UnauthorizedPage() {
  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-red-400 drop-shadow-lg" />
        </div>
        
        <h2 className="text-4xl font-black text-white">Access Denied</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
          You don't have permission to view this page. If you believe this is a mistake, please check your account role.
        </p>

        <div className="pt-8 space-y-3">
          <Link 
            href="/"
            className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7226FF, #160078)', boxShadow: '0 0 20px rgba(114,38,255,0.4)' }}
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          
          <Link href="/login" className="w-full py-3.5 rounded-xl font-bold text-sm text-white/50 border border-white/10 hover:bg-white/5 transition-colors block">
            Switch Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
