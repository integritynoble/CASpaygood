// pages/api/signin.ts
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // Should be your client's origin in production
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });

  // Set HttpOnly cookie
  res.setHeader('Set-Cookie', serialize('jwt', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    path: '/',
    sameSite: 'strict', // CSRF protection
  }));

  return res.status(200).json({ user: data.user });
}
