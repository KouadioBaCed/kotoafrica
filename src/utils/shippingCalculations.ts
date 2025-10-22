import { ShippingMethod } from '../types';

// Délais de livraison en jours
export const SHIPPING_DELAYS = {
  maritime: { min: 45, max: 60 },
  aerien: { min: 7, max: 15 },
  express: { min: 3, max: 7 },
} as const;

/**
 * Calcule la date de livraison estimée en fonction du mode de livraison
 * @param orderDate - Date de la commande
 * @param shippingMethod - Mode de livraison
 * @param useMaxDelay - Si true, utilise le délai maximum, sinon la moyenne
 * @returns Date estimée de livraison
 */
export function calculateEstimatedDelivery(
  orderDate: string | Date,
  shippingMethod: ShippingMethod,
  useMaxDelay: boolean = true
): Date {
  const date = new Date(orderDate);
  const delays = SHIPPING_DELAYS[shippingMethod];

  // Utilise le délai max par défaut pour être prudent
  const daysToAdd = useMaxDelay ? delays.max : Math.floor((delays.min + delays.max) / 2);

  date.setDate(date.getDate() + daysToAdd);
  return date;
}

/**
 * Obtient le libellé du délai de livraison
 */
export function getShippingDelayLabel(shippingMethod: ShippingMethod): string {
  const delays = SHIPPING_DELAYS[shippingMethod];
  return `${delays.min}-${delays.max} jours`;
}

/**
 * Obtient le coût estimé du transport (à adapter selon vos tarifs)
 */
export function getShippingCost(shippingMethod: ShippingMethod, weight: number = 1): number {
  const baseCosts = {
    maritime: 5000,  // 5000 FCFA de base
    aerien: 15000,   // 15000 FCFA de base
    express: 30000,  // 30000 FCFA de base
  };

  return baseCosts[shippingMethod] * weight;
}

/**
 * Détermine si une commande contient des produits asiatiques
 */
export function hasAsianProducts(products: Array<{ product: { origin: string } }>): boolean {
  return products.some(item => item.product.origin === 'asia');
}
