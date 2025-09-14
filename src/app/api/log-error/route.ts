import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables for Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const errorData = await request.json();
    
    // Basic validation
    if (!errorData || typeof errorData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid error data' },
        { status: 400 }
      );
    }
    
    // Extract and structure the error data
    const { 
      message, 
      name, 
      stack, 
      code, 
      statusCode, 
      context, 
      timestamp, 
      url, 
      userAgent,
      componentStack,
      retryable,
      originalError
    } = errorData;
    
    // Insert error into the database
    const { data, error } = await supabase
      .from('error_logs')
      .insert([
        {
          message,
          name,
          stack: stack?.substring(0, 10000), // Limit stack trace length
          code,
          status_code: statusCode,
          context: context ? JSON.stringify(context) : null,
          timestamp: timestamp || new Date().toISOString(),
          url,
          user_agent: userAgent,
          component_stack: componentStack,
          is_retryable: retryable || false,
          original_error: originalError ? JSON.stringify(originalError) : null,
          environment: process.env.NODE_ENV || 'development',
        },
      ])
      .select();
    
    if (error) {
      console.error('Error saving error log:', error);
      return NextResponse.json(
        { error: 'Failed to log error' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, id: data?.[0]?.id });
    
  } catch (error) {
    console.error('Error in error logging endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add rate limiting to this endpoint
export const dynamic = 'force-dynamic';
export const maxDuration = 5; // 5 seconds max duration
