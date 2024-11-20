'use client';

import { CardWrapper } from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { loginSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { FormInput } from '@/components/auth/form-input';
import { toast, Toaster } from 'sonner'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      accountId: '',
      password: ''
    }
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      // Call your API route to validate credentials on the server
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('API returned success:', data);

      if (!response.ok) {
        // Display a toast error if the API returns an error response (e.g., user not found)
        toast.error(data.message || 'Invalid account or password.');
        return;
      }

      // Perform client-side signIn if the credentials are valid
      const signInResult = await signIn('credentials', {
        accountId: values.accountId,
        password: values.password,
        redirect: false, // Prevent the automatic redirect
      });

      if (signInResult?.error) {
        // Show an error toast if signIn failed (wrong password, etc.)
        toast.error(signInResult.error || 'Invalid credentials');
        return;
      }

      toast.success('Login successful!');
      startTransition(() => {
        router.push('/dashboard');
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  });

  return (
    <CardWrapper
      headerTitle="Login"
      headerDescription="Timperio Customer Relationship Management System"
      backButtonLabel="Don't have an account? Register"
      backButtonHref="/register"
    >
      <Toaster />
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="accountId"
              label="Account ID"
              type="text"
              placeholder="Enter your Account ID"
              isPending={isPending}
            />
            <div>
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="******"
                isPending={isPending}
              />
              <Button
                size="sm"
                variant="link"
                className="-mt-6 w-full justify-end p-0 text-xs text-blue-500"
                asChild
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="bg-gray-700 hover:bg-gray-500 w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
