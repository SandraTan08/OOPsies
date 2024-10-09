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
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      userId: '',
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
  
      if (!response.ok) {
        toast.error(data.message || 'Something went wrong');
        return;
      }
  
      // Perform client-side signIn if the credentials are valid
      const signInResult = await signIn('credentials', {
        userId: data.userId,
        password: values.password,
        redirect: false, // Prevent the automatic redirect
      });
  
      if (signInResult?.error) {
        toast.error(signInResult.error || 'Invalid credentials');
        return;
      }
  
      // Redirect to the account page upon successful login
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong.');
    }
  });

  return (
    <CardWrapper
      headerTitle="Login"
      headerDescription="Welcome back! Please fill out the form below before logging in to the website."
      backButtonLabel="Don't have an account? Register"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="userId"
              label="User ID"
              type="number"
              placeholder="Enter your staff ID"
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
              >
                <Link href="/reset">Forgot password?</Link>
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

// Update the loginSchema to validate staff_id
