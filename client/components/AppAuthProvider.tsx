"use client";

import { ClerkProvider } from "@clerk/nextjs";
import SessionWrapper from "@/components/SessionWrapper";
import { isClerkEnabled } from "@/lib/auth-config";

export default function AppAuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkEnabled()) {
    return (
      <ClerkProvider signInUrl="/login" signUpUrl="/signup">
        {children}
      </ClerkProvider>
    );
  }

  return <SessionWrapper>{children}</SessionWrapper>;
}
