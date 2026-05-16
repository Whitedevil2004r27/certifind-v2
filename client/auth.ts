import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
let pool: Pool | null = null;

function getPool() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });
  }

  return pool;
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const email = String(credentials.email).trim().toLowerCase();
      const password = String(credentials.password);

      const result = await getPool().query(
        "SELECT id, name, email, password, role FROM users WHERE lower(email) = $1",
        [email]
      );
      const user = result.rows[0];

      if (!user?.password) return null;

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(connectionString ? { adapter: PostgresAdapter(getPool()) } : {}),
  providers,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "student";
      }

      if ((!token.id || !token.role) && token.email) {
        try {
          const result = await getPool().query(
            "SELECT id, role FROM users WHERE lower(email) = $1",
            [token.email.toLowerCase()]
          );
          const dbUser = result.rows[0];
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role ?? "student";
          }
        } catch (error) {
          console.warn("NextAuth JWT database lookup skipped:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});
