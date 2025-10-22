import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Gift, Send, ArrowDownToLine, CreditCard } from 'lucide-react';
import { formatFCFA } from '../utils/logistics';
import type { WalletTransaction, UserBonus, MobileMoneyTransfer } from '../types';

type WalletPageProps = {
  onNavigate: (page: string) => void;
};

// Données mock pour le développement
const mockWalletData = {
  balance: 125000,
  bonusBalance: 15000,
  totalEarned: 450000,
  totalSpent: 325000,
};

const mockTransactions: WalletTransaction[] = [
  {
    id: '1',
    walletId: 'w1',
    type: 'credit',
    amount: 50000,
    description: 'Rechargement wallet',
    balanceBefore: 75000,
    balanceAfter: 125000,
    createdAt: '2025-01-15T10:30:00',
    status: 'completed',
  },
  {
    id: '2',
    walletId: 'w1',
    type: 'bonus',
    amount: 15000,
    description: 'Bonus de parrainage',
    balanceBefore: 0,
    balanceAfter: 15000,
    createdAt: '2025-01-14T14:20:00',
    status: 'completed',
  },
  {
    id: '3',
    walletId: 'w1',
    type: 'debit',
    amount: 35000,
    description: 'Paiement commande #KA-225-001234',
    reference: 'KA-225-001234',
    balanceBefore: 110000,
    balanceAfter: 75000,
    createdAt: '2025-01-13T16:45:00',
    status: 'completed',
  },
];

const mockBonuses: UserBonus[] = [
  {
    id: '1',
    userId: 'u1',
    bonusId: 'b1',
    bonus: {
      id: 'b1',
      code: 'WELCOME2025',
      type: 'percentage',
      value: 10,
      minPurchase: 50000,
      maxDiscount: 20000,
      validFrom: '2025-01-01',
      validUntil: '2025-03-31',
      usageLimit: 1,
      usageCount: 0,
      isActive: true,
      description: 'Bonus de bienvenue - 10% de réduction',
      createdAt: '2025-01-01',
    },
    status: 'available',
  },
  {
    id: '2',
    userId: 'u1',
    bonusId: 'b2',
    bonus: {
      id: 'b2',
      code: 'CASHBACK50',
      type: 'fixed',
      value: 5000,
      validFrom: '2025-01-10',
      validUntil: '2025-02-10',
      usageLimit: 1,
      usageCount: 0,
      isActive: true,
      description: 'Cashback 5000 FCFA',
      createdAt: '2025-01-10',
    },
    status: 'available',
  },
];

export function WalletPage({ onNavigate }: WalletPageProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'bonuses' | 'transfer'>('transactions');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferProvider, setTransferProvider] = useState<'orange_money' | 'mtn_money' | 'moov_money' | 'wave'>('orange_money');
  const [transferPhone, setTransferPhone] = useState('');

  const handleTransfer = () => {
    // TODO: Implémenter la logique de transfert
    alert(`Transfert de ${transferAmount} FCFA vers ${transferProvider} - ${transferPhone}`);
    setShowTransferModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#4A2C2A] flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            Mon Wallet KÔTO
          </h1>
          <p className="text-gray-600 mt-2">Gérez votre portefeuille, vos bonus et vos transferts</p>
        </div>

        {/* Soldes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Solde principal */}
          <div className="bg-gradient-to-br from-[#1BAA70] to-[#158f5d] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-90">Solde disponible</span>
              <Wallet className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-3xl font-extrabold mb-2">{formatFCFA(mockWalletData.balance)}</div>
            <button
              onClick={() => setShowTransferModal(true)}
              className="mt-4 w-full bg-white text-[#1BAA70] py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Transférer
            </button>
          </div>

          {/* Bonus */}
          <div className="bg-gradient-to-br from-[#FFD835] to-[#FFC107] rounded-2xl shadow-lg p-6 text-[#4A2C2A]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Bonus disponibles</span>
              <Gift className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold mb-2">{formatFCFA(mockWalletData.bonusBalance)}</div>
            <button
              onClick={() => setActiveTab('bonuses')}
              className="mt-4 w-full bg-[#4A2C2A] text-white py-2 rounded-lg font-semibold hover:bg-[#3A1C1A] transition"
            >
              Voir mes bonus
            </button>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600">Statistiques</span>
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Total gagné</div>
                <div className="text-lg font-bold text-green-600">{formatFCFA(mockWalletData.totalEarned)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total dépensé</div>
                <div className="text-lg font-bold text-red-600">{formatFCFA(mockWalletData.totalSpent)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b flex">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'transactions'
                  ? 'bg-[#1BAA70] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📊 Transactions
            </button>
            <button
              onClick={() => setActiveTab('bonuses')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'bonuses'
                  ? 'bg-[#1BAA70] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🎁 Mes Bonus
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'transfer'
                  ? 'bg-[#1BAA70] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              💸 Transfert
            </button>
          </div>

          <div className="p-6">
            {/* Transactions */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#4A2C2A] mb-4">Historique des transactions</h3>
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'credit' || transaction.type === 'bonus'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' || transaction.type === 'bonus' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{transaction.description}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                        </div>
                        {transaction.reference && (
                          <div className="text-xs text-gray-400">Réf: {transaction.reference}</div>
                        )}
                      </div>
                    </div>
                    <div className={`text-right ${
                      transaction.type === 'credit' || transaction.type === 'bonus'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      <div className="text-lg font-bold">
                        {transaction.type === 'credit' || transaction.type === 'bonus' ? '+' : '-'}
                        {formatFCFA(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Solde: {formatFCFA(transaction.balanceAfter)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bonus */}
            {activeTab === 'bonuses' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#4A2C2A] mb-4">Mes bonus et réductions</h3>
                {mockBonuses.map((userBonus) => (
                  <div
                    key={userBonus.id}
                    className="border-2 border-[#FFD835] rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-5 h-5 text-[#FFD835]" />
                          <span className="font-bold text-[#4A2C2A] text-lg">{userBonus.bonus.code}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            userBonus.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : userBonus.status === 'used'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {userBonus.status === 'available' ? 'Disponible' : userBonus.status === 'used' ? 'Utilisé' : 'Expiré'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{userBonus.bonus.description}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          {userBonus.bonus.type === 'percentage' && (
                            <span>• Réduction de {userBonus.bonus.value}%</span>
                          )}
                          {userBonus.bonus.type === 'fixed' && (
                            <span>• Bonus de {formatFCFA(userBonus.bonus.value)}</span>
                          )}
                          {userBonus.bonus.minPurchase && (
                            <span>• Min: {formatFCFA(userBonus.bonus.minPurchase)}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Valide jusqu'au {new Date(userBonus.bonus.validUntil).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {userBonus.status === 'available' && (
                        <button className="bg-[#1BAA70] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#158f5d] transition">
                          Utiliser
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transfert */}
            {activeTab === 'transfer' && (
              <div>
                <h3 className="text-lg font-bold text-[#4A2C2A] mb-4">Transférer vers Mobile Money</h3>
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      💡 Transférez votre solde wallet vers votre compte Mobile Money en quelques clics.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Montant à transférer
                      </label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                        placeholder="Montant en FCFA"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Solde disponible: {formatFCFA(mockWalletData.balance)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Opérateur Mobile Money
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'orange_money', label: 'Orange Money', color: 'bg-orange-500' },
                          { value: 'mtn_money', label: 'MTN Money', color: 'bg-yellow-500' },
                          { value: 'moov_money', label: 'Moov Money', color: 'bg-blue-500' },
                          { value: 'wave', label: 'Wave', color: 'bg-pink-500' },
                        ].map((provider) => (
                          <button
                            key={provider.value}
                            onClick={() => setTransferProvider(provider.value as any)}
                            className={`p-3 rounded-lg border-2 transition ${
                              transferProvider === provider.value
                                ? 'border-[#1BAA70] bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full ${provider.color} mx-auto mb-2`}></div>
                            <div className="text-xs font-semibold">{provider.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        value={transferPhone}
                        onChange={(e) => setTransferPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1BAA70]"
                        placeholder="+225 XX XX XX XX XX"
                      />
                    </div>

                    <button
                      onClick={handleTransfer}
                      className="w-full bg-[#1BAA70] text-white py-4 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Confirmer le transfert
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
