import NextAuth from 'next-auth';
import authConfig from '../../../../auth.config';

export const { auth, handlers, signOut, signIn } = NextAuth(authConfig);

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST }; // Export both GET and POST methods
