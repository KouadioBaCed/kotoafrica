'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui'
import { mockOrders, mockUsers } from '@/data/mockData'
import {
  Users,
  UserCheck,
  Crown,
  ShoppingBag,
  CheckCircle,
  Truck,
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react'

export default function ReportingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Calcul des statistiques clients
  const totalClients = mockUsers.filter(u => u.role === 'client').length
  const standardClients = mockUsers.filter(u => u.role === 'client' && (!u.subscriptionType || u.subscriptionType === 'standard')).length
  const premiumClients = mockUsers.filter(u => u.role === 'client' && u.subscriptionType === 'premium').length

  // Calcul des statistiques commandes
  const totalOrders = mockOrders.length
  const receivedOrders = mockOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length
  const processingOrders = mockOrders.filter(o => o.status === 'confirmed' || o.status === 'shipped').length
  const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length

  // Statistiques par statut de colis
  const packageStats = {
    received: mockOrders.filter(o => o.packageStatus === 'received').length,
    shipping: mockOrders.filter(o => o.packageStatus === 'shipping').length,
    receivedAbidjan: mockOrders.filter(o => o.packageStatus === 'received_abidjan').length,
    delivering: mockOrders.filter(o => o.packageStatus === 'delivering').length,
    delivered: mockOrders.filter(o => o.packageStatus === 'delivered' || o.status === 'delivered').length,
  }

  // Taux de conversion
  const conversionRate = totalClients > 0 ? ((totalOrders / totalClients) * 100).toFixed(1) : '0'
  const premiumRate = totalClients > 0 ? ((premiumClients / totalClients) * 100).toFixed(1) : '0'

  const clientStats = [
    {
      title: 'Total Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12%',
    },
    {
      title: 'Clients Standard',
      value: standardClients,
      icon: UserCheck,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      trend: '+8%',
    },
    {
      title: 'Clients Premium',
      value: premiumClients,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      trend: '+25%',
    },
    {
      title: 'Taux Premium',
      value: `${premiumRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+5%',
    },
  ]

  const orderStats = [
    {
      title: 'Commandes Reçues',
      value: receivedOrders,
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'En Traitement',
      value: processingOrders,
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Livrées',
      value: deliveredOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Commandes',
      value: totalOrders,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
            Reporting Global
          </h1>
          <p className="text-gray-600">Statistiques détaillées des clients et commandes</p>
        </div>

        {/* Filtres de période */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
            <option value="all">Tout</option>
          </select>
        </div>
      </div>

      {/* Statistiques Clients */}
      <div className="mb-8">
        <h2 className="text-2xl font-poppins font-semibold text-secondary mb-4">
          Statistiques Clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                {stat.trend && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-secondary">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistiques Commandes */}
      <div className="mb-8">
        <h2 className="text-2xl font-poppins font-semibold text-secondary mb-4">
          Statistiques Commandes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderStats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-secondary">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Statut Détaillé des Colis */}
      <div className="mb-8">
        <h2 className="text-2xl font-poppins font-semibold text-secondary mb-4">
          Statut des Colis
        </h2>
        <Card>
          <div className="space-y-4">
            {/* Barre de progression */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold text-gray-600">Progression globale</div>
                <div className="text-xs font-semibold text-gray-600">
                  {totalOrders > 0 ? Math.round((packageStats.delivered / totalOrders) * 100) : 0}% livrés
                </div>
              </div>
              <div className="flex h-3 overflow-hidden text-xs bg-gray-200 rounded">
                <div
                  style={{ width: `${(packageStats.received / totalOrders) * 100}%` }}
                  className="bg-yellow-500"
                  title="Reçu"
                />
                <div
                  style={{ width: `${(packageStats.shipping / totalOrders) * 100}%` }}
                  className="bg-blue-500"
                  title="En shipping"
                />
                <div
                  style={{ width: `${(packageStats.receivedAbidjan / totalOrders) * 100}%` }}
                  className="bg-purple-500"
                  title="Réceptionné Abidjan"
                />
                <div
                  style={{ width: `${(packageStats.delivering / totalOrders) * 100}%` }}
                  className="bg-orange-500"
                  title="En livraison"
                />
                <div
                  style={{ width: `${(packageStats.delivered / totalOrders) * 100}%` }}
                  className="bg-green-500"
                  title="Livré"
                />
              </div>
            </div>

            {/* Détails par statut */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mb-2" />
                <span className="text-sm text-gray-600 mb-1">Reçu</span>
                <span className="text-2xl font-bold text-secondary">{packageStats.received}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full mb-2" />
                <span className="text-sm text-gray-600 mb-1">Shipping</span>
                <span className="text-2xl font-bold text-secondary">{packageStats.shipping}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full mb-2" />
                <span className="text-sm text-gray-600 mb-1">Abidjan</span>
                <span className="text-2xl font-bold text-secondary">{packageStats.receivedAbidjan}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full mb-2" />
                <span className="text-sm text-gray-600 mb-1">Livraison</span>
                <span className="text-2xl font-bold text-secondary">{packageStats.delivering}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mb-2" />
                <span className="text-sm text-gray-600 mb-1">Livré</span>
                <span className="text-2xl font-bold text-secondary">{packageStats.delivered}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau de détails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières inscriptions */}
        <Card>
          <h2 className="text-xl font-poppins font-semibold mb-4">Dernières Inscriptions</h2>
          <div className="space-y-3">
            {mockUsers.filter(u => u.role === 'client').slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${user.subscriptionType === 'premium' ? 'bg-yellow-100' : 'bg-gray-100'} flex items-center justify-center`}>
                    {user.subscriptionType === 'premium' ? (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <UserCheck className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.subscriptionType === 'premium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscriptionType === 'premium' ? 'Premium' : 'Standard'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Commandes récentes */}
        <Card>
          <h2 className="text-xl font-poppins font-semibold mb-4">Commandes Récentes</h2>
          <div className="space-y-3">
            {mockOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div>
                  <p className="font-semibold text-secondary">{order.trackingNumber}</p>
                  <p className="text-sm text-gray-600">{order.products.length} produit(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent-green">{order.total.toLocaleString('fr-FR')} FCFA</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'confirmed' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'delivered' ? 'Livré' :
                     order.status === 'shipped' ? 'Expédié' :
                     order.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
