import { z } from 'zod';

const ACCOUNT_ID_SCHEMA = z
  .string()
  .length(4, 'Staff ID must be 4 digits long.')

export const loginSchema = z.object({
  accountId: ACCOUNT_ID_SCHEMA, // Updated from EMAIL_SCHEMA to STAFF_ID_SCHEMA
  password: z.string().min(1, 'Password is required.')
});

export const registerSchema = z.object({
  accountId: ACCOUNT_ID_SCHEMA, // Updated from EMAIL_SCHEMA to STAFF_ID_SCHEMA
  name: z
    .string()
    .min(1, {
      message: 'Name is required.'
    })
    .min(4, 'Name must be at least 4 characters.')
    .max(24, 'Maximum length of Name is 24 characters.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Password must be at least 6 characters.')
});

// Remove email-related schemas
export const resendSchema = z.object({
  accountId: ACCOUNT_ID_SCHEMA // Updated from EMAIL_SCHEMA to STAFF_ID_SCHEMA
});

export const resetPasswordSchema = z.object({
  accountId: ACCOUNT_ID_SCHEMA // Updated from EMAIL_SCHEMA to STAFF_ID_SCHEMA
});

// ... existing newPasswordSchema and twoFactorSchema remain unchanged ...

export const profileSchema = z.object({
  name: z.optional(
    z
      .string()
      .min(1, {
        message: 'Name is required.'
      })
      .min(4, 'Name must be at least 4 characters.')
      .max(24, 'Maximum length of Name is 24 characters.')
  ),
  staff_id: z.optional(ACCOUNT_ID_SCHEMA), // Updated from email to staff_id
  password: z.optional(
    z.string().min(6, 'Password must be at least 6 characters.')
  ),
  newPassword: z.optional(
    z.string().min(6, 'New Password must be at least 6 characters.')
  ),
  isTwoFactorEnabled: z.optional(z.boolean())
});
// ... existing refinements remain unchanged ...
