import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client'; // Make sure your Role enum is exported
import { env } from './env';

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/signin',
    error: '/signin' // Redirect to signin page on error
  },
  debug: env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ account }) {
      // Allow OAuth sign-ins
      if (account?.provider === 'google' || account?.provider === 'github') {
        return true;
      }
      
      // Allow credentials sign-in
      if (account?.provider === 'credentials') {
        return true;
      }
      
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Assign role from user if available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any       
        token.role = (user as any).role || Role.BUYER;
      }
      
      // Store OAuth account info
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).accessToken = token.accessToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).provider = token.provider;
      }
      return session;
    }
  },
  secret: env.NEXTAUTH_SECRET
};
