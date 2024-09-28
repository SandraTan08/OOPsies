'use server';

import { signIn } from '@/auth';
import { loginSchema } from '@/schemas';
import { z } from 'zod';
import { response as generateResponse } from '@/lib/utils'; // Renamed `response` to `generateResponse`

export const login = async (payload: z.infer<typeof loginSchema>) => {
  console.log('Login function called with payload:', payload); // Log the incoming payload

  const validatedFields = loginSchema.safeParse(payload);
  if (!validatedFields.success) {
    console.log('Validation failed:', validatedFields.error); // Log validation errors
    return generateResponse(null, 'Invalid fields', 442, new Error('Invalid Fields'));
  }

  const { staff_id, password } = validatedFields.data;

  try {
    // Check if user exists
    const fetchResponse = await fetch(`http://localhost:8080/api/v1/users/staff/${Number(staff_id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Handle non-200 status codes
    if (!fetchResponse.ok) {
      console.log('User not found for staff_id:', staff_id); // Log user not found
      return generateResponse(null, 'Invalid credentials.', 401, new Error('Invalid credentials.'));
    }

    const existingUser = await fetchResponse.json();

    // Check if the user exists and has a valid staff_id
    if (!existingUser || !existingUser.staff_id) {
      console.log('User not found for staff_id:', staff_id); // Log user not found
      return generateResponse(null, 'Invalid credentials.', 401, new Error('Invalid credentials.'));
    }

    // Check if the staff_id matches the password (assuming they are the same)
    if (staff_id.toString() !== password) {
      console.log('StaffID does not match the password for staff_id:', staff_id); // Log mismatch
      return generateResponse(null, 'Invalid credentials.', 401, new Error('Invalid credentials.'));
    }

    // If everything is correct, proceed to sign in
    const signInResult = await signInCredentials(existingUser.staff_id.toString(), password);
    console.log('SignIn Result:', signInResult); // Log the sign-in result
    if (signInResult.success) {
      console.log('Login successful, returning response.'); // Log successful login
      return generateResponse({ userId: existingUser.staff_id.toString() }, 'User fetched successfully', 200);
    }

    console.log('Login failed, returning error response.'); // Log failed login
    return signInResult; // Return the error response from signInCredentials

  } catch (error) {
    console.error('Error fetching user or processing login:', error); // Log the error
    return generateResponse(null, 'Server error', 500, new Error('Server error'));
  }
};

// Sign in credentials from next-auth
export const signInCredentials = async (staff_id: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      staff_id,
      password,
      redirect: false, // Prevent the automatic redirect
    });

    if (result?.error) {
      return generateResponse({
        success: false,
        error: {
          code: 401,
          message: 'Invalid credentials.',
        },
      });
    }

    return generateResponse({ success: true }); // Sign-in successful
  } catch (error) {
    console.error('SignIn error:', error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return generateResponse({
            success: false,
            error: {
              code: 401,
              message: 'Invalid credentials.',
            },
          });
        case 'OAuthAccountNotLinked':
          return generateResponse({
            success: false,
            error: {
              code: 403,
              message: 'Another account already registered with the same Email Address.',
            },
          });
        case 'Verification':
          return generateResponse({
            success: false,
            error: {
              code: 422,
              message: 'Verification failed. Please try again.',
            },
          });
        case 'AuthorizedCallbackError':
          return generateResponse({
            success: false,
            error: {
              code: 422,
              message: 'Authorization failed. Please try again.',
            },
          });
        default:
          return generateResponse({
            success: false,
            error: {
              code: 500,
              message: 'Something went wrong.',
            },
          });
      }
    }

    throw error;
  }
};
