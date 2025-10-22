import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign, LayoutDashboard, UserCog, PackageSearch, TrendingUp, BarChart3, ShoppingCart, FileText, Star, MapPin } from 'lucide-react';
import { UsersManagement } from '../components/admin/UsersManagement';
import { ProductsManagement } from '../components/admin/ProductsManagement';
import { OrdersManagement } from '../components/admin/OrdersManagement';
import { QuoteRequestsManagement } from '../components/admin/QuoteRequestsManagement';
import { AllReviewsManagement } from '../components/admin/AllReviewsManagement';
import { LocalProductsOrders } from '../components/admin/LocalProductsOrders';
import { mockUsers } from '../data/mockData';
import { products } from '../data/products';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Stats = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  productsAfrica: number;
  productsAsia: number;
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'products' | 'orders' | 'quotes' | 'reviews' | 'local-products'>('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    productsAfrica: 0,
    productsAsia: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fonction pour charger les données - facile à remplacer par un appel API
  function loadDashboardData() {
    try {
      // Données utilisateurs
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter(u => u.status === 'active').length;

      // Données produits
      const totalProducts = products.length;
      const productsAfrica = products.filter(p => p.origin === 'africa').length;
      const productsAsia = products.filter(p => p.origin === 'asia').length;

      // Simulation de données de commandes (à remplacer par de vraies données du backend)
      const totalOrders = 156;
      const totalRevenue = 12450000; // en FCFA

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        activeUsers,
        productsAfrica,
        productsAsia,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Données pour le graphique de ventes sur 7 jours
  const salesData = [
    { day: 'Lun', ventes: 45, commandes: 12 },
    { day: 'Mar', ventes: 52, commandes: 15 },
    { day: 'Mer', ventes: 38, commandes: 10 },
    { day: 'Jeu', ventes: 61, commandes: 18 },
    { day: 'Ven', ventes: 75, commandes: 22 },
    { day: 'Sam', ventes: 88, commandes: 28 },
    { day: 'Dim', ventes: 65, commandes: 20 },
  ];

  // Données pour les produits par catégorie
  const categoryData = [
    { name: 'Textile', count: products.filter(p => p.category === 'Textile').length },
    { name: 'Vêtements', count: products.filter(p => p.category === 'Vêtements').length },
    { name: 'Accessoires', count: products.filter(p => p.category === 'Accessoires').length },
    { name: 'Électronique', count: products.filter(p => p.category === 'Électronique').length },
    { name: 'Maison', count: products.filter(p => p.category === 'Maison').length },
    { name: 'Art & Déco', count: products.filter(p => p.category === 'Art & Déco').length },
  ];

  // Données pour les utilisateurs par rôle
  const userRolesData = [
    { name: 'Clients', count: mockUsers.filter(u => u.role === 'client').length },
    { name: 'Admins', count: mockUsers.filter(u => u.role === 'admin').length },
    { name: 'Fournisseurs Afrique', count: mockUsers.filter(u => u.role === 'fournisseur_afrique').length },
    { name: 'Fournisseurs Asie', count: mockUsers.filter(u => u.role === 'fournisseur_asie').length },
  ];

  // Données pour le graphique circulaire des commandes
  const orderStatusData = [
    { name: 'En attente', value: 25, color: '#FFD835' },
    { name: 'Confirmées', value: 45, color: '#1BAA70' },
    { name: 'En livraison', value: 35, color: '#1C3D73' },
    { name: 'Livrées', value: 51, color: '#4A2C2A' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFD835] border-t-[#4A2C2A]"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Titre avec design KÔTO AFRICA - Responsive */}
        <div className="bg-gradient-to-r from-[#FFD835] to-[#FFD835]/80 rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#4A2C2A] font-montserrat flex items-center gap-2 md:gap-3">
            <span className="text-3xl md:text-5xl">🏢</span>
            <span className="leading-tight">Administration KÔTO AFRICA</span>
          </h1>
          <p className="text-[#4A2C2A]/80 mt-1 md:mt-2 font-poppins text-xs md:text-base">
            Gérez votre plateforme de commerce panafricain
          </p>
        </div>

        {/* Tabs Navigation avec couleurs KÔTO - Responsive */}
        <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 bg-white rounded-lg md:rounded-xl shadow-md p-1 md:p-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <UserCog className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <PackageSearch className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Produits</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Commandes</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Devis</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <Star className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Avis</span>
          </button>
          <button
            onClick={() => setActiveTab('local-products')}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 font-semibold transition-all rounded-lg font-poppins text-sm md:text-base whitespace-nowrap ${
              activeTab === 'local-products'
                ? 'bg-[#1BAA70] text-white shadow-md'
                : 'text-[#4A2C2A] hover:bg-[#FFD835]/20'
            }`}
          >
            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Produits Locaux</span>
          </button>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Card Utilisateurs */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#1BAA70] via-[#1BAA70] to-[#158f5d] rounded-2xl shadow-xl p-4 md:p-6 text-white transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-bold font-montserrat animate-pulse">{stats.totalUsers}</span>
                      <p className="text-xs text-white/90 font-medium mt-1 flex items-center gap-1 justify-end">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        {stats.activeUsers} actifs
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold font-poppins text-sm md:text-base tracking-wide">Utilisateurs</p>
                  <div className="mt-2 h-1 w-0 group-hover:w-full bg-white/30 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Card Produits */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#1C3D73] via-[#1C3D73] to-[#152d56] rounded-2xl shadow-xl p-4 md:p-6 text-white transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Package className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-bold font-montserrat animate-pulse">{stats.totalProducts}</span>
                      <p className="text-xs text-white/90 font-medium mt-1">
                        {stats.productsAfrica} 🌍 | {stats.productsAsia} 🌏
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold font-poppins text-sm md:text-base tracking-wide">Produits</p>
                  <div className="mt-2 h-1 w-0 group-hover:w-full bg-white/30 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Card Commandes */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#FFD835] via-[#FFD835] to-[#f5ca1a] rounded-2xl shadow-xl p-4 md:p-6 text-[#4A2C2A] transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A2C2A]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4A2C2A]/5 rounded-full -ml-12 -mb-12 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#4A2C2A]/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <ShoppingBag className="w-6 h-6 md:w-7 md:h-7 text-[#4A2C2A]" />
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-bold font-montserrat animate-pulse">{stats.totalOrders}</span>
                      <p className="text-xs text-[#4A2C2A]/80 font-medium mt-1">Ce mois 📦</p>
                    </div>
                  </div>
                  <p className="font-semibold font-poppins text-sm md:text-base tracking-wide">Commandes</p>
                  <div className="mt-2 h-1 w-0 group-hover:w-full bg-[#4A2C2A]/20 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Card Revenu */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#4A2C2A] via-[#4A2C2A] to-[#352020] rounded-2xl shadow-xl p-4 md:p-6 text-white transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD835]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFD835]/5 rounded-full -ml-12 -mb-12 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD835]/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-[#FFD835]" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl md:text-3xl font-bold font-montserrat animate-pulse">
                        {(stats.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                      <p className="text-xs text-[#FFD835] font-bold mt-1">FCFA 💰</p>
                    </div>
                  </div>
                  <p className="font-semibold font-poppins text-sm md:text-base tracking-wide">Chiffre d'affaires</p>
                  <div className="mt-2 h-1 w-0 group-hover:w-full bg-[#FFD835]/30 rounded-full transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Graphiques - Grid 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Graphique des ventes sur 7 jours */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-4 md:p-6 transition-all duration-300 border-2 border-transparent hover:border-[#1BAA70]/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1BAA70] to-[#158f5d] rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-[#4A2C2A] font-poppins">Ventes des 7 derniers jours</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="ventes"
                      stroke="#1BAA70"
                      strokeWidth={3}
                      name="Ventes (k FCFA)"
                      dot={{ fill: '#1BAA70', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commandes"
                      stroke="#FFD835"
                      strokeWidth={3}
                      name="Commandes"
                      dot={{ fill: '#FFD835', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique circulaire des commandes */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-4 md:p-6 transition-all duration-300 border-2 border-transparent hover:border-[#FFD835]/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFD835] to-[#f5ca1a] rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md">
                    <ShoppingBag className="w-5 h-5 text-[#4A2C2A]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-[#4A2C2A] font-poppins">Statut des commandes</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique des produits par catégorie */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#1BAA70]" />
                  <h2 className="text-lg md:text-xl font-bold text-[#4A2C2A]">Produits par catégorie</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                    <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#1C3D73" name="Nombre de produits" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique des utilisateurs par rôle */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#1BAA70]" />
                  <h2 className="text-lg md:text-xl font-bold text-[#4A2C2A]">Utilisateurs par rôle</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userRolesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} />
                    <YAxis dataKey="name" type="category" stroke="#666" style={{ fontSize: '11px' }} width={150} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#1BAA70" name="Nombre" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-[#4A2C2A] mb-4">Activité récente</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Nouvelle commande #KA-2025-156</p>
                    <p className="text-xs text-gray-600">Client: Fatou Touré - 45,000 FCFA</p>
                    <p className="text-xs text-gray-500 mt-1">Il y a 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Nouveau produit ajouté</p>
                    <p className="text-xs text-gray-600">Masque Baoulé Premium - Catégorie: Art & Déco</p>
                    <p className="text-xs text-gray-500 mt-1">Il y a 1 heure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Nouvel utilisateur inscrit</p>
                    <p className="text-xs text-gray-600">Marie Koffi - Client Abidjan</p>
                    <p className="text-xs text-gray-500 mt-1">Il y a 3 heures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Stock faible</p>
                    <p className="text-xs text-gray-600">Tissu Wax Premium - Seulement 5 unités restantes</p>
                    <p className="text-xs text-gray-500 mt-1">Il y a 6 heures</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && <UsersManagement />}

        {/* Products Tab Content */}
        {activeTab === 'products' && <ProductsManagement />}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && <OrdersManagement />}

        {/* Quotes Tab Content */}
        {activeTab === 'quotes' && <QuoteRequestsManagement />}

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && <AllReviewsManagement />}

        {/* Local Products Tab Content */}
        {activeTab === 'local-products' && <LocalProductsOrders />}
      </div>
    </div>
  );
}
