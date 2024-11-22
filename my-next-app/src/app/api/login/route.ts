import { loginSchema } from '@/schemas';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
    const fetchResponse = await fetch(`${backendUrl}account/${accountId}`, {
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

    if (!existingUser || !existingUser.accountId) {
      return NextResponse.json({ message: 'Invalid accountId' }, { status: 401 });
    }

    // Use bcrypt to compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // If everything is valid, return success
    return NextResponse.json({ message: 'Login successful', accountId: existingUser.accountId }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user or processing login:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}