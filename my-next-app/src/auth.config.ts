import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';


export const authConfig = {
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        staff_id: { label: 'Staff ID', type: 'number' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const response = await fetch(`http://localhost:8080/api/v1/users/staff/${credentials.staff_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add any authorization headers here if necessary
            }
          });
  
        const user = await response.json();
        const { staff_id, password } = credentials;
        console.log('User found:', user); // Log user for debugging
        if (!user) {
          console.log('Staff ID not found:', staff_id); // Log staff_id not found
          return null; // If user doesn't exist, return null (block login)
        }

        // Validate password (assuming staff_id == password for your case)
        if (user.staff_id.toString() === password) {
          console.log('Login successful for staff_id:', staff_id);
          return user; // If valid, return the user object (successful login)
        } else {
          console.log('Invalid password for staff_id:', staff_id);
          return null; // If password doesn't match, return null (block login)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('User in JWT callback:', user); // Debug user in JWT
        token.id = user.id;
        token.staff_id = user.staff_id; // Add staff_id to the JWT token
        token.staff_fname = user.staff_fname;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Token in Session callback:', token); // Debug token

      // Ensure session.user exists and assign token values
      if (token) {
        session.user = session.user || {}; // Initialize session.user if it doesn't exist
        session.user.id = token.id as string;
        session.user.staff_id = token.staff_id as number; // Assign staff_id from token to session.user
        session.user.staff_fname = token.staff_fname as string;
      }

      console.log('Session after modification:', session); // Debug session after assignment
      return session;
    }
  },
  pages: {
    signIn: '/' //sigin page
  }
} satisfies xNextAuthConfig;

export default authConfig;
