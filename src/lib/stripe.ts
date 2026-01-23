// Stripe configuration and utilities

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const PRICE_IDS = {
  free: 'price_free',
  pro: 'price_pro', // Replace with actual Stripe price ID
  enterprise: 'price_enterprise', // Replace with actual Stripe price ID
} as const;

export type PlanType = keyof typeof PRICE_IDS;

export function getPlanFromPriceId(priceId: string): PlanType {
  const entry = Object.entries(PRICE_IDS).find(([, id]) => id === priceId);
  return (entry?.[0] as PlanType) || 'free';
}

export function isValidPriceId(priceId: string): boolean {
  return Object.values(PRICE_IDS).includes(priceId as any);
}
