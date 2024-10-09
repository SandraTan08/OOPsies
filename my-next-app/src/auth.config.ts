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
        userId: { label: 'User Id', type: 'text' }, // use 'text' for userId type
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // Fetch user data based on userId
        const response = await fetch(`http://localhost:8080/api/v1/users/${credentials.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const user = await response.json();

        // Extract userId and password from credentials
        const { userId, password } = credentials || {};
        console.log('User found:', user); // Log user for debugging

        if (!user) {
          console.log('User ID not found:', userId); // Log if user is not found
          return null; // Return null to block login
        }

        // Assuming you're validating that userId == password (for demo purposes)
        if (user.userId.toString() === password) {
          console.log('Login successful for userId:', userId);
          return user; // If valid, return user object to proceed with login
        } else {
          console.log('Invalid password for userId:', userId);
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
    async jwt({ token, user }) {
      // When user logs in for the first time, add userId to the token
      if (user) {
        token.userId = user.id || user.userId;
        token.userId = user.id || user.userId;  // Make sure to handle both `id` and `userId`
        token.username = user.username;  // Add username to the token
        token.role = user.role;  // Add role to the token
        token.department = user.department;  // Add department to the token
        token.position = user.position; // Assuming user has `userId`
      }
      return token;
    },
    async session({ session, token }) {
      // Pass userId from token to session
      if (token) {
        session.user.userId = token.userId as string;
        session.user.username = token.username as string;  // Ensure username is passed to session
        session.user.role = token.role as string;
        session.user.department = token.department as string;
        session.user.position = token.position as string; // Attach userId to session.user
      }
      return session;
    },
  },
  pages: {
    signIn: '/' // Specify the sign-in page
  }
};

export default authConfig;
