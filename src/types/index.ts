export interface Product {
  id: string
  name: string
  description: string
  price: number
  origin: 'africa' | 'asia'
  country: string
  category: string
  stock: number
  images: string[]
  rating: number
  reviews: number
  supplier: Supplier
  deliveryTime: number // en jours
}

export interface Supplier {
  id: string
  name: string
  type: 'african' | 'asian'
  country: string
  rating: number
  productsCount: number
  verified: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  country: string
  customId: string // Format: KA-[code postal]-[numéro]
  role: 'admin' | 'client' | 'fournisseur_afrique' | 'fournisseur_asie'
  status: 'active' | 'inactive' | 'suspended'
  subscriptionType?: 'standard' | 'premium' // Type d'abonnement client
  premiumDiscount?: number // Pourcentage de réduction pour les clients premium
  createdAt: string
  lastLogin?: string
}

export type ShippingMethod = 'maritime' | 'aerien' | 'express'
export type OrderDetailedStatus =
  | 'order_placed'           // Commande passée
  | 'supplier_contacted'     // Fournisseur contacté (pour produits Asie)
  | 'order_processing'       // En cours de traitement chez le fournisseur
  | 'picked_up'              // Récupéré par KÔTO
  | 'in_transit_to_africa'   // En transit vers l'Afrique
  | 'customs_clearance'      // Dédouanement
  | 'arrived_warehouse'      // Arrivé à l'entrepôt Abidjan
  | 'out_for_delivery'       // En cours de livraison
  | 'delivered'              // Livré
  | 'cancelled'              // Annulé

export interface Order {
  id: string
  userId: string
  products: OrderProduct[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'partial' | 'completed'
  paidAmount: number
  createdAt: string
  updatedAt: string
  shippingAddress: string
  trackingNumber?: string
  packageStatus?: 'received' | 'shipping' | 'received_abidjan' | 'delivering' | 'delivered' // Statut détaillé du colis

  // Nouveaux champs pour le suivi détaillé
  shippingMethod?: ShippingMethod // Mode de livraison (maritime/aérien/express)
  estimatedDelivery?: string // Date estimée de livraison
  detailedStatus?: OrderDetailedStatus // Statut détaillé de la commande
  statusHistory?: OrderStatusUpdate[] // Historique des changements de statut
  isAsianProduct?: boolean // Indique si la commande contient des produits d'Asie
  supplierInfo?: {
    name: string
    contactDate?: string
    orderConfirmedDate?: string
  }
}

export interface OrderStatusUpdate {
  status: OrderDetailedStatus
  date: string
  description: string
  location?: string
}

export interface OrderProduct {
  product: Product
  quantity: number
  price: number
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: string
  userName: string
  userAvatar?: string
  status: 'pending' | 'approved' | 'rejected' // Modération
  moderatedAt?: string
  moderatedBy?: string
  images?: string[] // Photos du produit par le client
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  type: 'deposit' | 'balance'
  status: 'pending' | 'completed' | 'failed'
  method: string
  createdAt: string
}

// Conciergerie
export interface ConciergeRequest {
  id: string
  userId: string
  userName: string
  userType: 'standard' | 'premium'
  productName: string
  productDescription: string
  estimatedPrice?: number
  status: 'pending' | 'quoted' | 'negotiating' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface Quote {
  id: string
  conciergeRequestId: string
  originalPrice: number
  discount: number // Pourcentage de réduction
  finalPrice: number
  validUntil: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  sentAt?: string
  notes?: string
}

// Incidents
export interface Incident {
  id: string
  orderId?: string
  userId: string
  userName: string
  type: 'delivery' | 'product' | 'payment' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  subject: string
  description: string
  whatsappNumber?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  assignedTo?: string
  resolution?: string
}

// Paramètres Premium
export interface PremiumSettings {
  id: string
  tierName: string // Ex: "Premium Silver", "Premium Gold"
  discountPercentage: number
  monthlyFee: number
  benefits: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

// Statistiques financières
export interface FinancialStats {
  period: string // Ex: "2024-01" pour janvier 2024
  platformCommissions: number
  logisticsRevenue: number
  premiumSubscriptions: number
  conciergeRevenue: number
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
}

// Wallet Kôto Africa
export interface Wallet {
  id: string
  userId: string
  balance: number // Solde en FCFA
  bonusBalance: number // Bonus disponibles en FCFA
  totalEarned: number // Total gagné depuis la création
  totalSpent: number // Total dépensé
  createdAt: string
  updatedAt: string
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: 'credit' | 'debit' | 'bonus' | 'transfer_in' | 'transfer_out'
  amount: number
  description: string
  reference?: string // Référence de commande ou transaction
  balanceBefore: number
  balanceAfter: number
  createdAt: string
  status: 'pending' | 'completed' | 'failed'
}

export interface Bonus {
  id: string
  code: string // Code promo unique
  type: 'percentage' | 'fixed' | 'cashback' // Type de bonus
  value: number // Valeur (% ou montant fixe)
  minPurchase?: number // Montant minimum d'achat
  maxDiscount?: number // Réduction maximum
  validFrom: string
  validUntil: string
  usageLimit: number // Nombre d'utilisations max
  usageCount: number // Nombre d'utilisations actuelles
  isActive: boolean
  description: string
  createdAt: string
}

export interface UserBonus {
  id: string
  userId: string
  bonusId: string
  bonus: Bonus
  usedAt?: string
  orderId?: string
  status: 'available' | 'used' | 'expired'
}

export interface MobileMoneyTransfer {
  id: string
  walletId: string
  userId: string
  amount: number
  provider: 'orange_money' | 'mtn_money' | 'moov_money' | 'wave'
  phoneNumber: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  transactionRef?: string
  createdAt: string
  completedAt?: string
  failureReason?: string
}
