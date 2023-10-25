import Pricing from '@/components/Pricing';
import Chatbot from '@/components/Chatbot';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <Chatbot
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
