import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

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
        accountId: { label: 'Account Id', type: 'text' }, // use 'text' for userId type
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // Fetch user data based on userId
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

        // Extract userId and password from credentials
        const { accountId, password } = credentials || {};
        console.log('User found:', account); // Log user for debugging

        if (!account) {
          console.log('User ID not found:', accountId); // Log if user is not found
          return null; // Return null to block login
        }

        // Assuming you're validating that userId == password (for demo purposes)
        if (account.password === password) {
          console.log('Login successful for userId:', accountId);
          return account; // If valid, return user object to proceed with login
        } else {
          console.log('Invalid password for userId:', accountId);
          return null; // Return null to block login
        }
      }
    })
  ],
  session: {
    strategy: 'jwt', // Use JWT-based sessions
    maxAge: 24 * 60 * 60, // 24 hours session expiry
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // When the user logs in for the first time (or when they refresh the session)
      if (account && user) {
        token.accountId = user.accountId || account.providerAccountId;  // Use the `id` from the `user` or `providerAccountId`
        token.accountUserName = user.accountUserName || '';  // Add the username (if available) from the user
        token.role = user.role || 'user';  // Add role from `user`, or default to 'user'
        token.accountEmail = user.accountEmail || '';  // Add email from `user`
        console.log('JWT token:', token); // Debug: log the token
      }
  
      return token;
    },
    async session({ session, token }) {
      // Initialize `session.account` if it does not exist
      session.account = session.account || {};
  
      // Populate session fields from the token
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
    signIn: '/' // Specify the sign-in page
  }
};

export default authConfig;
