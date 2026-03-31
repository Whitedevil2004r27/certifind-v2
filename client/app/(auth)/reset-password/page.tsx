'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'At least 1 uppercase letter')
    .regex(/[0-9]/, 'At least 1 number')
    .regex(/[^A-Za-z0-9]/, 'At least 1 special character'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const INPUT_CLASS = "w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all focus:bg-white/10";
const BORDER_DEFAULT = "border-white/10 focus:border-purple-500/70";
const BORDER_ERROR = "border-red-500/50 focus:border-red-500";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [watchPass, setWatchPass] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try {
      await updatePassword(data.password);
      router.push('/login?reset=success');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Create New Password</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Enter your new password below. Make it strong!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input {...register('password')} type={showPass ? 'text' : 'password'}
                placeholder="New password"
                onInput={(e) => setWatchPass((e.target as HTMLInputElement).value)}
                className={`${INPUT_CLASS} pl-10 pr-10 ${errors.password ? BORDER_ERROR : BORDER_DEFAULT}`} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            <div className="mt-3">
              <PasswordStrengthMeter password={watchPass} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              className={`${INPUT_CLASS} pl-10 pr-10 ${errors.confirmPassword ? BORDER_ERROR : BORDER_DEFAULT}`} />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7226FF, #160078)', boxShadow: '0 0 20px rgba(114,38,255,0.4)' }}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Reset Password
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
