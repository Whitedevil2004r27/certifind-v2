'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import AuthLayout from '@/components/auth/AuthLayout';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import { useAuth } from '@/hooks/useAuth';
import { isClerkEnabled } from '@/lib/auth-config';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

const INPUT_CLASS = 'w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all focus:bg-white/10';
const BORDER_DEFAULT = 'border-white/10 focus:border-purple-500/70';
const BORDER_ERROR = 'border-red-500/50 focus:border-red-500';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getSafeCallbackUrl() {
  const params = new URLSearchParams(window.location.search);
  const callbackUrl = params.get('callbackUrl');

  return callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : '/dashboard';
}

function ClerkLogin() {
  return (
    <AuthLayout>
      <div className="flex justify-center">
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none",
            },
          }}
        />
      </div>
    </AuthLayout>
  );
}

function LegacyLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const lockMins = isLocked ? Math.ceil((lockedUntil - Date.now()) / 60000) : 0;

  const onSubmit = async (data: FormData) => {
    if (isLocked) {
      setError(`Too many attempts. Try again in ${lockMins} min.`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(data.email, data.password, getSafeCallbackUrl());
      router.refresh();
    } catch (err: any) {
      const next = attempts + 1;
      setAttempts(next);

      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError('Too many failed attempts. You are locked out for 15 minutes.');
      } else {
        setError(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
          <p className="text-white/40 text-sm">Sign in to continue your learning journey.</p>
        </div>

        <SocialAuthButtons />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              {...register('email')}
              type="email"
              placeholder="Email address"
              className={`${INPUT_CLASS} pl-10 ${errors.email ? BORDER_ERROR : BORDER_DEFAULT}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                className={`${INPUT_CLASS} pl-10 pr-10 ${errors.password ? BORDER_ERROR : BORDER_DEFAULT}`}
              />
              <button
                type="button"
                onClick={() => setShowPass((value) => !value)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="/forgot-password" className="text-xs text-white/30 hover:text-purple-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7226FF, #160078)', boxShadow: '0 0 20px rgba(114,38,255,0.4)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm">
          No account?{' '}
          <Link href="/signup" className="font-bold transition-colors" style={{ color: '#7226FF' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  if (isClerkEnabled()) {
    return <ClerkLogin />;
  }

  return <LegacyLoginForm />;
}
