import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Check, Phone, CreditCard, Package } from 'lucide-react';
import { calculateShippingCost, convertToFCFA, formatFCFA, formatUSD, generateOrderCode, type ShippingMode } from '../utils/logistics';

type PaymentMethod = 'mtn' | 'wave' | 'orange' | null;
type PaymentMode = 'immediate' | 'on_delivery';

type CheckoutPageProps = {
  onNavigate: (page: string) => void;
};

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, getTotalPrice, getTotalWeight, getTotalVolume, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('immediate');

  // Informations de livraison
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Récupérer le mode de transport depuis le localStorage
  const [shippingMode, setShippingMode] = useState<ShippingMode>('sea');

  useEffect(() => {
    const savedShippingMode = localStorage.getItem('shippingMode') as ShippingMode;
    if (savedShippingMode) {
      setShippingMode(savedShippingMode);
    }
  }, []);

  const subtotal = getTotalPrice();
  const totalWeight = getTotalWeight();
  const totalVolume = getTotalVolume();

  const shippingCost = items.length > 0
    ? calculateShippingCost(totalWeight, totalVolume, shippingMode).total
    : 0;

  // Calcul du montant à payer selon le mode de paiement
  const amountToPay = paymentMode === 'immediate' ? subtotal + shippingCost : shippingCost;
  const total = subtotal + shippingCost;
  const totalFCFA = convertToFCFA(total);
  const amountToPayFCFA = convertToFCFA(amountToPay);

  const paymentNumbers = {
    mtn: '+225 07 12 34 56 78',
    wave: '+225 05 23 45 67 89',
    orange: '+225 07 34 56 78 90',
  };

  function handlePlaceOrder() {
    // Validation
    if (!firstName || !lastName || !phone || !address || !city) {
      alert('Veuillez remplir toutes les informations de livraison');
      return;
    }

    if (!paymentMethod) {
      alert('Veuillez sélectionner un moyen de paiement');
      return;
    }

    setProcessing(true);

    // Simuler le traitement de la commande
    setTimeout(() => {
      const code = generateOrderCode();

      // Ici on peut enregistrer la commande localement ou l'envoyer à un backend
      console.log('Commande:', {
        orderCode: code,
        customer: { firstName, lastName, phone, address, city },
        items,
        paymentMethod,
        paymentMode,
        shippingMode,
        subtotal,
        shippingCost,
        amountToPay,
        total,
      });

      clearCart();
      localStorage.removeItem('shippingMode');
      setOrderCode(code);
      setSuccess(true);
      setProcessing(false);
    }, 2000);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-[#1BAA70] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-3xl font-extrabold text-[#4A2C2A] mb-4">
            Commande confirmée !
          </h2>

          <p className="text-gray-600 mb-6">
            Votre commande a été enregistrée avec succès
          </p>

          <div className="bg-[#FFF9E6] border-2 border-[#FFD835] rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Code de commande</p>
            <p className="text-2xl font-bold text-[#4A2C2A] mb-4 font-mono">{orderCode}</p>

            <div className="border-t border-[#FFD835] pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant total</span>
                <span className="font-bold text-[#1BAA70]">
                  {formatUSD(total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total (FCFA)</span>
                <span className="font-bold text-[#1BAA70]">
                  {formatFCFA(totalFCFA)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant payé</span>
                <span className="font-bold text-[#4A2C2A]">
                  {formatUSD(amountToPay)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mode de paiement</span>
                <span className="font-bold text-gray-700">
                  {paymentMode === 'immediate' ? 'Immédiat' : 'À la livraison'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Moyen de paiement</span>
                <span className="font-bold text-gray-700 uppercase">
                  {paymentMethod}
                </span>
              </div>
              {paymentMode === 'on_delivery' && (
                <p className="text-xs text-gray-500 mt-2 bg-yellow-50 p-2 rounded">
                  Vous paierez {formatUSD(subtotal)} ({formatFCFA(convertToFCFA(subtotal))}) à la livraison
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Un SMS de confirmation vous sera envoyé au {phone}
          </p>

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-[#1BAA70] text-white py-3 rounded-lg hover:bg-[#158f5d] transition font-bold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    onNavigate('cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de livraison */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-6">
                Informations de livraison
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                    placeholder="+225 XX XX XX XX XX"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                  placeholder="Votre adresse complète"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                  placeholder="Votre ville"
                />
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-6">
                Mode de paiement
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMode('immediate')}
                  className={`p-4 rounded-lg border-2 transition ${
                    paymentMode === 'immediate'
                      ? 'border-[#1BAA70] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMode === 'immediate' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                  <div className="text-sm font-semibold">Paiement immédiat</div>
                  <div className="text-xs text-gray-500 mt-1">{formatUSD(total)}</div>
                </button>

                <button
                  onClick={() => setPaymentMode('on_delivery')}
                  className={`p-4 rounded-lg border-2 transition ${
                    paymentMode === 'on_delivery'
                      ? 'border-[#1BAA70] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Package className={`w-6 h-6 mx-auto mb-2 ${paymentMode === 'on_delivery' ? 'text-[#1BAA70]' : 'text-gray-400'}`} />
                  <div className="text-sm font-semibold">À la livraison</div>
                  <div className="text-xs text-gray-500 mt-1">{formatUSD(shippingCost)}</div>
                </button>
              </div>

              {paymentMode === 'on_delivery' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Paiement à la livraison :</strong> Vous payez uniquement les frais de logistique ({formatUSD(shippingCost)}) maintenant.
                    Le reste ({formatUSD(subtotal)}) sera à payer lors de la réception de votre commande.
                  </p>
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Moyen de paiement
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'mtn', name: 'MTN Mobile Money', color: 'bg-yellow-500' },
                  { id: 'wave', name: 'Wave', color: 'bg-blue-500' },
                  { id: 'orange', name: 'Orange Money', color: 'bg-orange-500' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      paymentMethod === method.id
                        ? 'border-[#1BAA70] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {method.id.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{method.name}</div>
                        {paymentMethod === method.id && (
                          <div className="text-sm text-gray-600 mt-1">
                            Envoyer à : {paymentNumbers[method.id]}
                          </div>
                        )}
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="w-6 h-6 text-[#1BAA70]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-6">Résumé</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold">{formatUSD(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Logistique ({shippingMode === 'sea' ? 'Maritime' : 'Aérien'})</span>
                  <span className="font-semibold">{formatUSD(shippingCost)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-[#4A2C2A]">
                    <span>Total (USD)</span>
                    <span>{formatUSD(total)}</span>
                  </div>
                </div>
                <div className="bg-[#FFF9E6] border-2 border-[#FFD835] rounded-lg p-3">
                  <div className="flex justify-between text-lg font-extrabold text-[#1BAA70]">
                    <span>Total (FCFA)</span>
                    <span>{formatFCFA(totalFCFA)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">À payer maintenant</span>
                  <span className="text-xl font-bold text-[#1BAA70]">{formatUSD(amountToPay)}</span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {formatFCFA(amountToPayFCFA)}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-[#1BAA70] text-white py-4 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg disabled:opacity-50"
              >
                {processing ? 'Traitement...' : 'Confirmer la commande'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Paiement sécurisé et crypté
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
