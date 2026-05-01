import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { timingSafeEqual } from "crypto";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!credentials?.email || !credentials.password) return null;
        if (!adminEmail || !adminPassword) return null;

        const emailMatch = timingSafeEqual(Buffer.from(credentials.email), Buffer.from(adminEmail));
        const passwordMatch = timingSafeEqual(Buffer.from(credentials.password), Buffer.from(adminPassword));
        if (emailMatch && passwordMatch) {
          return {
            id: "admin",
            email: adminEmail,
            name: "Blog Admin",
            role: "admin"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role || "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    }
  }
};
