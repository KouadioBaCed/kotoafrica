// Tarifs de logistique en FCFA
export const LOGISTICS_RATES = {
  // Transport aérien rapide (10-17 jours)
  air_rapide: {
    perKg: 17000, // 17.000 FCFA/kg
    perM3: 0,
    baseRate: 0,
    minDays: 10,
    maxDays: 17,
  },
  // Transport aérien express (3-8 jours)
  air_express: {
    perKg: 27000, // 27.000 FCFA/kg
    perM3: 0,
    baseRate: 0,
    minDays: 3,
    maxDays: 8,
  },
  // Transport maritime sans moteur (40-70 jours)
  sea_no_motor: {
    perKg: 0,
    perM3: 220000, // 220.000 FCFA/m³
    baseRate: 0,
    minDays: 40,
    maxDays: 70,
  },
  // Transport maritime avec moteur (40-70 jours)
  sea_with_motor: {
    perKg: 0,
    perM3: 260000, // 260.000 FCFA/m³
    baseRate: 0,
    minDays: 40,
    maxDays: 70,
  },
};

// Taux de conversion USD vers FCFA (prix dollar mondial)
export const USD_TO_FCFA = 661.28;

export type ShippingMode = 'air_rapide' | 'air_express' | 'sea_no_motor' | 'sea_with_motor';

export interface ShippingCalculation {
  weightCost: number;
  volumeCost: number;
  baseCost: number;
  total: number;
  totalFCFA: number;
  mode: ShippingMode;
  deliveryDays: string;
}

/**
 * Calcule les frais de logistique en FCFA selon le mode de transport
 * - Avion: basé sur le poids (FCFA/kg)
 * - Bateau: basé sur le volume (FCFA/m³)
 */
export function calculateShippingCost(
  weight_kg: number,
  volume_m3: number,
  mode: ShippingMode
): ShippingCalculation {
  // Protection: si le mode n'est pas valide, utiliser air_rapide par défaut
  const validMode: ShippingMode = mode && LOGISTICS_RATES[mode] ? mode : 'air_rapide';
  const rates = LOGISTICS_RATES[validMode];

  let totalFCFA = 0;
  let weightCost = 0;
  let volumeCost = 0;

  // Transport aérien : calculé au poids
  if (mode === 'air_rapide' || mode === 'air_express') {
    weightCost = weight_kg * rates.perKg;
    totalFCFA = weightCost;
  }
  // Transport maritime : calculé au volume
  else if (mode === 'sea_no_motor' || mode === 'sea_with_motor') {
    volumeCost = volume_m3 * rates.perM3;
    totalFCFA = volumeCost;
  }

  const deliveryDays = `${rates.minDays}-${rates.maxDays} jours`;

  return {
    weightCost,
    volumeCost,
    baseCost: rates.baseRate,
    total: totalFCFA, // Pour compatibilité (déprécié)
    totalFCFA: Math.round(totalFCFA),
    mode: validMode,
    deliveryDays,
  };
}

/**
 * Convertit un montant USD en FCFA
 */
export function convertToFCFA(usd: number): number {
  return Math.round(usd * USD_TO_FCFA);
}

/**
 * Génère un code de commande unique au format KA-225-XXXXXX
 * 225 = indicatif de la Côte d'Ivoire
 */
export function generateOrderCode(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const uniqueNumber = (timestamp.slice(-3) + random).slice(0, 6).padStart(6, '0');

  return `KA-225-${uniqueNumber}`;
}

/**
 * Formate un montant en FCFA
 */
export function formatFCFA(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Formate un montant en USD
 */
export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Calcule le prix final d'un produit selon la formule:
 * Prix FCFA = Prix USD × Taux de change
 *
 * @param priceUSD - Prix du produit en USD
 * @returns Prix final en FCFA
 */
export function calculateProductPrice(priceUSD: number): number {
  const finalPrice = priceUSD * USD_TO_FCFA;
  return Math.round(finalPrice);
}
