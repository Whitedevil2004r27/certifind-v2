import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CertiFind | Auth',
};

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  // No Navbar or Footer — just the raw AuthLayout from each page
  return <>{children}</>;
}
