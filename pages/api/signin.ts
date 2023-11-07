import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to allow only certain origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // If it's an OPTIONS request (CORS preflight), respond with 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  } 
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password, code } = req.body;

  // Handle email/password sign-in
  if (email && password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
      
    })

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ user: data.user, session: data.session });
  } 

  
}
