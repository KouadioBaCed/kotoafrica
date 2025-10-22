'use client'

import React from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { mockProducts, mockOrders, mockPayments } from '@/data/mockData'
import { Package, DollarSign, ShoppingBag, TrendingUp, Plus } from 'lucide-react'

export default function FournisseurDashboard() {
  // Simuler un fournisseur connecté
  const supplierId = '1'
  const supplierProducts = mockProducts.filter(p => p.supplier.id === supplierId)
  const supplierOrders = mockOrders.filter(o =>
    o.products.some(p => p.product.supplier.id === supplierId)
  )
  const supplierRevenue = mockPayments
    .filter(p => supplierOrders.some(o => o.id === p.orderId))
    .reduce((sum, p) => sum + p.amount, 0)

  const stats = [
    {
      title: 'Produits actifs',
      value: supplierProducts.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Commandes reçues',
      value: supplierOrders.length,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Revenus',
      value: `${supplierRevenue.toLocaleString('fr-FR')} FCFA`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Ventes ce mois',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-montserrat font-extrabold text-secondary">
                Dashboard Fournisseur
              </h1>
              <p className="text-gray-600">Bienvenue, Artisanat Ivoirien</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-secondary">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Products and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Products */}
          <Card>
            <h2 className="text-2xl font-poppins font-semibold mb-6">Mes Produits</h2>
            <div className="space-y-4">
              {supplierProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div>
                    <p className="font-poppins font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product.price.toLocaleString('fr-FR')} FCFA</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card>
            <h2 className="text-2xl font-poppins font-semibold mb-6">Commandes Récentes</h2>
            <div className="space-y-4">
              {supplierOrders.map(order => (
                <div key={order.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div>
                    <p className="font-poppins font-semibold">{order.trackingNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'shipped' ? 'info' :
                        'warning'
                      }
                    >
                      {order.status === 'confirmed' ? 'Confirmée' :
                       order.status === 'shipped' ? 'Expédiée' :
                       order.status === 'delivered' ? 'Livrée' :
                       order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
