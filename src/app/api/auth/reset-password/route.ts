import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { password, token } = await request.json();

    if (!password || !token) {
      return NextResponse.json(
        { error: 'Password and token are required' },
        { status: 400 }
      );
    }

    // First, we need to sign in with the token
    const { data: { session }, error: sessionError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    });

    if (sessionError || !session) {
      console.error('Error verifying token:', sessionError);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Now update the password
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Error resetting password:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to reset password' },
        { status: error.status || 500 }
      );
    }

    // Sign out the user after password reset
    await supabase.auth.signOut();

    return NextResponse.json({
      message: 'Password has been reset successfully. Please sign in with your new password.'
    });

  } catch (error) {
    console.error('Unexpected error in reset password:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
