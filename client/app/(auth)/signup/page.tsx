'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import PasswordStrengthMeter, { getPasswordStrength } from '@/components/auth/PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'At least 1 uppercase letter')
    .regex(/[0-9]/, 'At least 1 number')
    .regex(/[^A-Za-z0-9]/, 'At least 1 special character'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'premium']),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const INPUT_CLASS = "w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all focus:bg-white/10";
const BORDER_DEFAULT = "border-white/10 focus:border-purple-500/70";
const BORDER_ERROR = "border-red-500/50 focus:border-red-500";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [watchPass, setWatchPass] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try {
      await signup(data.email, data.password, data.fullName, data.role);
      router.push('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
          <p className="text-white/40 text-sm">Start your learning journey for free.</p>
        </div>

        <SocialAuthButtons />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input {...register('fullName')} placeholder="Full name"
              className={`${INPUT_CLASS} pl-10 ${errors.fullName ? BORDER_ERROR : BORDER_DEFAULT}`} />
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input {...register('email')} type="email" placeholder="Email address"
              className={`${INPUT_CLASS} pl-10 ${errors.email ? BORDER_ERROR : BORDER_DEFAULT}`} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input {...register('password')} type={showPass ? 'text' : 'password'}
                placeholder="Password"
                onInput={(e) => setWatchPass((e.target as HTMLInputElement).value)}
                className={`${INPUT_CLASS} pl-10 pr-10 ${errors.password ? BORDER_ERROR : BORDER_DEFAULT}`} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            <div className="mt-2">
              <PasswordStrengthMeter password={watchPass} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              className={`${INPUT_CLASS} pl-10 pr-10 ${errors.confirmPassword ? BORDER_ERROR : BORDER_DEFAULT}`} />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Role */}
          <div>
            <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">I am a...</p>
            <div className="grid grid-cols-2 gap-2">
              {([['student', '🎓 Student', 'Free access to all courses'], ['premium', '⚡ Premium', 'Paid courses + certificates']] as const).map(([val, label, desc]) => (
                <label key={val}
                  className="flex flex-col gap-1 p-3 rounded-xl border cursor-pointer transition-all hover:border-purple-500/40"
                  style={{ borderColor: '#7226FF20', backgroundColor: '#160078' + '30' }}>
                  <input {...register('role')} type="radio" value={val} className="sr-only" />
                  <span className="text-sm font-black text-white">{label}</span>
                  <span className="text-[11px] text-white/40">{desc}</span>
                </label>
              ))}
            </div>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="font-bold" style={{ color: '#7226FF' }}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
