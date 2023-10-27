// /app/api/signin.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from 'types_db';
import { redirect } from 'next/navigation';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { persistSession: false }
);

/**
 * Handle user sign in with Supabase.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - Returns user, session or error object.
 */
const handleSignIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    const user = response.data?.user;
    const session = response.data?.session;
    const error = response.error;
  if (error) {
    throw error;
  }
  return { user, session };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Received request body:', req.body);
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;
            const { user, session } = await handleSignIn(email, password);
            return res.status(200).json({ user, session });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            } else {
                return res.status(401).json({ error: 'An unexpected error occurred.' });
            }
        }
    } 
}
