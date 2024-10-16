import { loginSchema } from '@/schemas';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body (it should be a JSON)
    const payload = await request.json();
    console.log('Payload:', payload);

    // Validate the incoming data using Zod schema
    const validatedFields = loginSchema.safeParse(payload);

    if (!validatedFields.success) {
      // Return 422 if validation fails
      return NextResponse.json({ message: 'Invalid fields', error: validatedFields.error }, { status: 422 });
    }

    const { accountId, password } = validatedFields.data;

    // Fetch the user from the database or another backend API
    const fetchResponse = await fetch(`http://localhost:8080/api/v1/account/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!fetchResponse.ok) {
      // Return 401 if user not found or other issues occur
      return NextResponse.json({ message: 'Invalid accountId' }, { status: 401 });
    }

    const existingUser = await fetchResponse.json();

    if (!existingUser || !existingUser.accountId || existingUser.password !== password) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // If everything is valid, return success
    return NextResponse.json({ message: 'Login successful', accountId: existingUser.accountId }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user or processing login:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
