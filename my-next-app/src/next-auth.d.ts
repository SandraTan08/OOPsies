// next-auth.d.ts

import NextAuth from "next-auth";

// Extend the `User` type with your custom fields
declare module "next-auth" {
  interface User {
    accountId: string;  // Add userId to User type
    accountUserName:string;
    role: string;
    accountEmail:string;
  }

  interface Session {
    account: {
      accountId: string;  // Add userId to Session type
      accountUserName:string;
      role: string;
      accountEmail:string;
      name?: string | null;  // Ensure the default fields are still present
      email?: string | null;
      image?: string | null;
    };
  }
}
