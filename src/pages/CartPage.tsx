import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ship, Plane, Zap, Anchor, CreditCard, Package } from 'lucide-react';
import { calculateShippingCost, calculateProductPrice, formatFCFA, formatUSD, type ShippingMode } from '../utils/logistics';
import type { PaymentMode } from '../contexts/CartContext';

type CartPageProps = {
  onNavigate: (page: string) => void;
};

export function CartPage({ onNavigate }: CartPageProps) {
  const { items, updateQuantity, updateShippingMode, updatePaymentMode, removeFromCart, getTotalPrice, getTotalPriceFCFA } = useCart();
  const [processing, setProcessing] = useState(false);

  const subtotalUSD = getTotalPrice();
  const subtotalFCFA = getTotalPriceFCFA();

  // Calculer les paiements en fonction du mode choisi pour chaque article
  let totalPayNow = 0;
  let totalPayLater = 0;

  items.forEach((item) => {
    const itemPriceFCFA = calculateProductPrice(item.price * item.quantity);
    const itemShippingCost = calculateShippingCost(
      item.weight_kg * item.quantity,
      item.volume_m3 * item.quantity,
      item.shippingMode
    ).totalFCFA;
    const halfShipping = Math.round(itemShippingCost / 2);

    if (item.paymentMode === 'immediate') {
      // Paiement immédiat: Produits + 50% logistique
      totalPayNow += itemPriceFCFA + halfShipping;
      totalPayLater += halfShipping;
    } else {
      // Paiement à la livraison: 50% logistique maintenant
      totalPayNow += halfShipping;
      totalPayLater += itemPriceFCFA + halfShipping;
    }
  });

  // Calculer les totaux
  const totalShippingCostFCFA = items.reduce((total, item) => {
    const itemShippingCost = calculateShippingCost(
      item.weight_kg * item.quantity,
      item.volume_m3 * item.quantity,
      item.shippingMode
    ).totalFCFA;
    return total + itemShippingCost;
  }, 0);

  const totalFCFA = subtotalFCFA + totalShippingCostFCFA;

  const handleCheckout = () => {
    onNavigate('checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Ajoutez des produits pour continuer vos achats</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#1BAA70] text-white px-6 py-3 rounded-lg hover:bg-[#158f5d] transition font-semibold"
          >
            Découvrir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemShippingCost = calculateShippingCost(
                item.weight_kg * item.quantity,
                item.volume_m3 * item.quantity,
                item.shippingMode
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#4A2C2A] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatUSD(item.price)} / unité
                      </p>
                      <p className="text-xs text-gray-400">
                        Poids: {item.weight_kg}kg • Volume: {item.volume_m3}m³
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <Minus className="w-4 h-4 text-[#4A2C2A]" />
                      </button>
                      <span className="text-lg font-bold text-[#4A2C2A] w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <Plus className="w-4 h-4 text-[#4A2C2A]" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-[#1BAA70] mb-2">
                        {formatUSD(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Sélecteur de mode d'envoi pour cet article */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mode d'envoi
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => updateShippingMode(item.id, 'air_rapide')}
                        className={`p-2 rounded-lg border-2 transition text-xs ${
                          item.shippingMode === 'air_rapide'
                            ? 'border-[#1BAA70] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Plane className={`w-4 h-4 mx-auto mb-1 ${item.shippingMode === 'air_rapide' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                        <div className="font-bold">Rapide</div>
                        <div className="text-gray-600">10-17j</div>
                      </button>
                      <button
                        onClick={() => updateShippingMode(item.id, 'air_express')}
                        className={`p-2 rounded-lg border-2 transition text-xs ${
                          item.shippingMode === 'air_express'
                            ? 'border-[#1BAA70] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Zap className={`w-4 h-4 mx-auto mb-1 ${item.shippingMode === 'air_express' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                        <div className="font-bold">Express</div>
                        <div className="text-gray-600">3-8j</div>
                      </button>
                      <button
                        onClick={() => updateShippingMode(item.id, 'sea_no_motor')}
                        className={`p-2 rounded-lg border-2 transition text-xs ${
                          item.shippingMode === 'sea_no_motor'
                            ? 'border-[#1BAA70] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Ship className={`w-4 h-4 mx-auto mb-1 ${item.shippingMode === 'sea_no_motor' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                        <div className="font-bold">Bateau S</div>
                        <div className="text-gray-600">40-70j</div>
                      </button>
                      <button
                        onClick={() => updateShippingMode(item.id, 'sea_with_motor')}
                        className={`p-2 rounded-lg border-2 transition text-xs ${
                          item.shippingMode === 'sea_with_motor'
                            ? 'border-[#1BAA70] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Anchor className={`w-4 h-4 mx-auto mb-1 ${item.shippingMode === 'sea_with_motor' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                        <div className="font-bold">Bateau M</div>
                        <div className="text-gray-600">40-70j</div>
                      </button>
                    </div>

                    {/* Coût logistique de cet article */}
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Frais logistique:</span>
                        <span className="font-bold text-blue-700">{formatFCFA(itemShippingCost.totalFCFA)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Délai: {itemShippingCost.deliveryDays}
                      </div>
                    </div>

                    {/* Sélecteur de mode de paiement pour cet article */}
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mode de paiement
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updatePaymentMode(item.id, 'immediate')}
                          className={`p-3 rounded-lg border-2 transition text-xs ${
                            item.paymentMode === 'immediate'
                              ? 'border-[#1BAA70] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <CreditCard className={`w-4 h-4 mx-auto mb-1 ${item.paymentMode === 'immediate' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                          <div className="font-bold">Immédiat</div>
                          <div className="text-gray-600">Maintenant</div>
                        </button>
                        <button
                          disabled
                          className="p-3 rounded-lg border-2 text-xs border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                        >
                          <Package className="w-4 h-4 mx-auto mb-1 text-gray-300" />
                          <div className="font-bold text-gray-400">À la livraison</div>
                          <div className="text-gray-400">Indisponible</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-6">Type de paiement</h2>

              {/* Info importante */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-700">
                  💡 Chaque article a son propre mode d'envoi. Sélectionnez le mode souhaité.
                </p>
              </div>

              {/* 1. Prix d'articles en CFA */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Prix d'articles en CFA</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Sous-total produits</span>
                    <span className="text-xl font-bold text-[#4A2C2A]">{formatFCFA(subtotalFCFA)}</span>
                  </div>
                </div>
              </div>

              {/* 2. Frais logistique après le choix */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Frais logistique (après choix)</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total logistique</span>
                    <span className="text-xl font-bold text-blue-700">{formatFCFA(totalShippingCostFCFA)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Selon les modes d'envoi choisis
                  </div>
                </div>
              </div>

              {/* 3. Total à payer */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Total à payer</h3>
                <div className="bg-gradient-to-br from-[#1BAA70] to-[#158f5d] rounded-lg p-4 text-white">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">À payer maintenant</span>
                      <span className="text-2xl font-extrabold">{formatFCFA(totalPayNow)}</span>
                    </div>
                    <div className="border-t border-white/30 pt-2 flex justify-between items-center">
                      <span className="text-sm opacity-90">Reste à la livraison</span>
                      <span className="text-lg font-bold opacity-90">{formatFCFA(totalPayLater)}</span>
                    </div>
                    <div className="border-t border-white/30 pt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold">Total commande</span>
                      <span className="text-xl font-extrabold">{formatFCFA(totalFCFA)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Mode de paiement */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Mode de paiement</h3>
                <div className="bg-white border-2 border-[#1BAA70] rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-[#1BAA70]" />
                    <div>
                      <div className="font-bold text-[#4A2C2A]">Paiement immédiat</div>
                      <div className="text-xs text-gray-600">Orange Money, MTN, Moov, Wave</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Bouton pour payer */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-[#1BAA70] text-white py-4 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
              >
                <span>{processing ? 'Traitement...' : 'Payer maintenant'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Paiement sécurisé et crypté
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
