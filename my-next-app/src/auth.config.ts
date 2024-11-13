import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';


export const authConfig: NextAuthOptions = {
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        accountId: { label: 'Account Id', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Credentials are undefined");
        }
        const response = await fetch(`http://localhost:8080/api/v1/account/${credentials.accountId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const account = await response.json();

        const { accountId, password } = credentials;
        console.log('User found:', account); // Log user for debugging

        if (!account) {
          console.log('User ID not found:', accountId);
          return null;
        }

        // Use bcrypt to compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, account.password);

        if (passwordMatch) {
          console.log('Login successful for userId:', accountId);
          return account;
        } else {
          console.log('Invalid password for userId:', accountId);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accountId = user.accountId || account.providerAccountId;
        token.accountUserName = user.accountUserName || '';
        token.role = user.role || 'user';
        token.accountEmail = user.accountEmail || '';
        console.log('JWT token:', token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Inside session callback', { session, token });
      session.account = session.account || {};
      if (token) {
        session.account = {
          accountId: token.accountId as string,
          accountUserName: token.accountUserName as string,
          role: token.role as string,
          accountEmail: token.accountEmail as string,
        }
        console.log('Session account:', session.account);
      }
      return session;
    }
  },
  pages: {
    signIn: '/'
  }
};

export default authConfig;