import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_resend_api_key);

export async function POST(req: Request) {
  try {
    const { from, to, subject, html } = await req.json();

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return NextResponse.json({ message: 'Email sent successfully', response });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email', error }, { status: 500 });
  }
}
