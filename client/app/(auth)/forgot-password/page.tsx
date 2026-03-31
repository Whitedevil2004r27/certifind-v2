'use client';
import { Mail, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

const INPUT_CLASS = "w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all focus:bg-white/10";
const BORDER_DEFAULT = "border-white/10 focus:border-purple-500/70";
const BORDER_ERROR = "border-red-500/50 focus:border-red-500";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Reset Password</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Enter your email address and we'll send you a link to reset your password securely.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-emerald-400 font-black text-lg">Check your inbox</h3>
            <p className="text-emerald-400/70 text-sm">
              We've sent a password reset link to your email. The link will expire in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7226FF, #160078)', boxShadow: '0 0 20px rgba(114,38,255,0.4)' }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-white/5 flex justify-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
