'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

export function useAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const login = useCallback(async (
    email: string,
    password: string,
    redirectTo = '/dashboard'
  ) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) throw new Error(result.error);
    
    router.push(redirectTo);
    router.refresh();
    return result;
  }, [router]);

  const signup = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    role: 'student' | 'premium' = 'student'
  ) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, role }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sign up');
    
    return login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  }, [router]);

  const getRole = useCallback(async (): Promise<string> => {
    return (session?.user as any)?.role ?? 'student';
  }, [session]);

  return { login, signup, logout, session, status, getRole };
}

