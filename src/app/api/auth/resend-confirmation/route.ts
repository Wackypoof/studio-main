import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, redirectTo } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectTo || `${new URL(request.url).origin}/dashboard`
      }
    });

    if (error) {
      console.error('Error resending confirmation email:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({
      message: 'Confirmation email resent successfully'
    });
  } catch (error) {
    console.error('Error in resend confirmation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
