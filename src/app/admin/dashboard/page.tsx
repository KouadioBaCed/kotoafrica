'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { mockOrders, mockProducts, mockUsers, mockPayments, mockReviews } from '@/data/mockData'
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, Star, Crown, AlertCircle, Briefcase, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0)
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length

  // Nouvelles statistiques
  const premiumClients = mockUsers.filter(u => u.role === 'client' && u.subscriptionType === 'premium').length
  const standardClients = mockUsers.filter(u => u.role === 'client' && (!u.subscriptionType || u.subscriptionType === 'standard')).length
  const openIncidents = 3 // Mock data
  const pendingConciergeRequests = 2 // Mock data

  const stats = [
    {
      title: 'Revenus Totaux',
      value: `${totalRevenue.toLocaleString('fr-FR')} FCFA`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/finances'
    },
    {
      title: 'Clients Total',
      value: mockUsers.filter(u => u.role === 'client').length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/utilisateurs'
    },
    {
      title: 'Clients Premium',
      value: premiumClients,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: '/admin/reporting'
    },
    {
      title: 'Commandes en cours',
      value: pendingOrders,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/admin/commandes'
    },
    {
      title: 'Incidents Ouverts',
      value: openIncidents,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/admin/incidents'
    },
    {
      title: 'Demandes Conciergerie',
      value: pendingConciergeRequests,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/admin/conciergerie'
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
          Dashboard Administrateur
        </h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme KÔTO AFRICA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.link || '#'}>
            <Card className="flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-secondary">{stat.value}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-poppins font-semibold mb-6">Commandes Récentes</h2>
          <div className="space-y-4">
            {mockOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                <div>
                  <p className="font-poppins font-semibold">{order.trackingNumber}</p>
                  <p className="text-sm text-gray-600">{order.products.length} produit(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent-green">{order.total.toLocaleString('fr-FR')} FCFA</p>
                  <p className="text-xs text-gray-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-poppins font-semibold mb-6">Produits Populaires</h2>
          <div className="space-y-4">
            {mockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                <div>
                  <p className="font-poppins font-semibold">{product.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{product.price.toLocaleString('fr-FR')} FCFA</p>
                  <p className="text-xs text-gray-600">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Accès Rapides */}
      <div className="mt-8">
        <h2 className="text-2xl font-poppins font-semibold mb-6">Accès Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/reporting">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Reporting Global</p>
                  <p className="text-sm text-gray-600">Statistiques détaillées</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/finances">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Finances</p>
                  <p className="text-sm text-gray-600">Revenus et commissions</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/conciergerie">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Conciergerie</p>
                  <p className="text-sm text-gray-600">Demandes Premium</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/incidents">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-red-50 to-red-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Incidents</p>
                  <p className="text-sm text-gray-600">Support client</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Paramètres Premium</p>
                  <p className="text-sm text-gray-600">Offres et abonnements</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/clients">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-indigo-50 to-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Clients</p>
                  <p className="text-sm text-gray-600">Gestion clients</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/produits">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Produits</p>
                  <p className="text-sm text-gray-600">Catalogue produits</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/commandes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">Commandes</p>
                  <p className="text-sm text-gray-600">Suivi des commandes</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
