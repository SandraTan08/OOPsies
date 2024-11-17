import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import Redis from 'ioredis';

// import { RedisAdapter } from '@next-auth/redis-adapter';

const redis = new Redis(process.env.REDIS_URL as string);
redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis connection error:', err));

const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));
const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs: number) =>
  Promise.race([fetch(url, options), timeout(timeoutMs)]);

export const authConfig: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        accountId: { label: 'Account Id', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        console.log('Authorize function started'); // Log to confirm entry
        if (!credentials) {
          console.error("Credentials are undefined");
          throw new Error("Credentials are undefined");
        }
        const response = await fetch(`http://localhost:8080/api/v1/account/${credentials.accountId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log('User ID not found:', credentials.accountId);
          return null;
        }

        const account = await response.json();

        // Use bcrypt to compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(credentials.password, account.password);

        if (passwordMatch) {
          console.log('Login successful for userId:', credentials.accountId);
          return {
            id: account.accountId,
            accountUserName: account.accountUserName,
            role: account.role,
            accountEmail: account.accountEmail
          };
        } else {
          console.log('Invalid password for userId:', credentials.accountId);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  // adapter: RedisAdapter(redis),
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // Allows cross-origin requests
        secure: process.env.NODE_ENV === 'production' ? true : false, // secure should be true in production
        path: '/',
        maxAge: 24 * 60 * 60,  // Keep cookie for 1 day
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Only update the token if there is new user or account data (e.g., on login)
      if (user || account) {
        token.accountId = user?.id || account?.providerAccountId;
        token.accountUserName = user?.accountUserName || '';
        token.role = user?.role || 'user';
        token.accountEmail = user?.accountEmail || '';
        console.log('Updated JWT token:', token); // Log updated token

      }
      return token;
    },
    
    async session({ session, token }) {
      session.account = {
        accountId: token.accountId as string,
        accountUserName: token.accountUserName as string,
        role: token.role as string,
        accountEmail: token.accountEmail as string,
      };
      console.log('Session account created:', session.account);
      return session;
    }
  },
  pages: {
    signIn: '/'
  }
};

export default authConfig;
