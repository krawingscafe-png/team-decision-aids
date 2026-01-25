import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';
const MOCK_MODE = true; // Toggle for testing without real Stripe

interface CheckoutOptions {
  customerEmail?: string;
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = useCallback(async (priceId: string, options?: CheckoutOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      if (MOCK_MODE) {
        // Redirect to checkout page with plan info
        await new Promise(resolve => setTimeout(resolve, 300));
        const planName = priceId.replace('price_', '');
        window.location.href = `/checkout?plan=${planName}`;
        return;
      }

      const successUrl = `${window.location.origin}/login?success=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing?canceled=true`;

      const response = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          email: options?.customerEmail,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    initiateCheckout,
    isLoading,
    error,
  };
}
