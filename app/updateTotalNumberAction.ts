// updateTotalNumberAction.ts
'use strict';
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { getSession } from '@/app/supabase-server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types_db';
import { cookies } from 'next/headers';

export const getTotalNumber = async () => {
  const supabase = createServerActionClient<Database>({ cookies });
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    console.error("User is not logged in.");
    return 0; // or a suitable default
  }

  const { data, error } = await supabase
    .from('users')
    .select('total_number')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching total number:", error);
    return 0; // or a suitable default
  }

  return data?.total_number || 0;
};

export const updateTotalNumber = async (additionalMessages: number) => {
  const currentTotalNumber = await getTotalNumber();

  const newTotalNumber = currentTotalNumber + additionalMessages;

  const supabase = createServerActionClient<Database>({ cookies });
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  const { error } = await supabase
    .from('users')
    .update({ total_number: newTotalNumber })
    .eq('id', user.id);

  if (error) {
    console.error("Error updating total number:", error);
  }

  revalidatePath('/usage'); // Revalidate the usage page after updating
};
