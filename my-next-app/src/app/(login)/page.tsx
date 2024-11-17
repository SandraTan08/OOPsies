import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }; // Ensure the error is optional
}) {
  if (searchParams?.error) {
    redirect(`/error?message=${searchParams.error}`);
  }

  return <LoginForm />;
}
