// next-auth.d.ts

import NextAuth from "next-auth";

// Extend the `User` type with your custom fields
declare module "next-auth" {
  interface User {
    userId: string;  // Add userId to User type
    username:string;
    role: string;
    department:string;
    position:string;
  }

  interface Session {
    user: {
      userId: string;  // Add userId to Session type
      username:string;
      role: string;
      department:string;
      position:string;
      name?: string | null;  // Ensure the default fields are still present
      email?: string | null;
      image?: string | null;
    };
  }
}
