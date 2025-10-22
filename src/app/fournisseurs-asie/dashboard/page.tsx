'use client'

import React from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { mockProducts, mockOrders } from '@/data/mockData'
import { Package, Truck, RefreshCw, AlertCircle, UploadCloud } from 'lucide-react'

export default function FournisseurAsieDashboard() {
  const supplierId = '3'
  const asianProducts = mockProducts.filter(p => p.supplier.id === supplierId)
  const asianOrders = mockOrders.filter(o =>
    o.products.some(p => p.product.supplier.id === supplierId)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-montserrat font-extrabold text-secondary">
                Dashboard Fournisseur Asiatique
              </h1>
              <p className="text-gray-600">Asian Electronics Co.</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Synchroniser le catalogue
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Alert for API Integration */}
        <Card className="mb-8 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-2">Intégration API</h3>
              <p className="text-gray-700 mb-4">
                Votre catalogue est automatiquement synchronisé via notre API.
                Les stocks, prix et images sont mis à jour toutes les heures.
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Dernière synchronisation</p>
                  <p className="font-semibold">Il y a 15 minutes</p>
                </div>
                <div>
                  <p className="text-gray-600">Prochaine mise à jour</p>
                  <p className="font-semibold">Dans 45 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Produits synchronisés</p>
                <p className="text-2xl font-bold">{asianProducts.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Commandes importées</p>
                <p className="text-2xl font-bold">{asianOrders.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <UploadCloud className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Statut API</p>
                <Badge variant="success">Connecté</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Products and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-2xl font-poppins font-semibold mb-6">Catalogue Synchronisé</h2>
            <div className="space-y-4">
              {asianProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div>
                    <p className="font-poppins font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock} • Délai: {product.deliveryTime}j
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product.price.toLocaleString('fr-FR')} FCFA</p>
                    <Badge variant="success" className="text-xs">Actif</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-poppins font-semibold mb-6">Commandes Importées</h2>
            <div className="space-y-4">
              {asianOrders.map(order => (
                <div key={order.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div>
                    <p className="font-poppins font-semibold">{order.trackingNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.products.length} produit(s)
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'shipped' ? 'info' :
                      'warning'
                    }
                  >
                    {order.status === 'confirmed' ? 'À préparer' :
                     order.status === 'shipped' ? 'Expédiée' :
                     order.status === 'delivered' ? 'Livrée' :
                     order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
