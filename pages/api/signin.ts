import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
export default async function handler(req, res) {
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
