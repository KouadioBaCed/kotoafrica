'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Card, Button, Badge, Input } from '@/components/ui'
import { mockOrders, mockUsers } from '@/data/mockData'
import { User, Package, Star, Settings } from 'lucide-react'

export default function ProfilPage() {
  const user = mockUsers[0]
  const userOrders = mockOrders.filter(o => o.userId === user.id)

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-montserrat font-extrabold text-secondary mb-8">
          Mon Profil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">{user.name.charAt(0)}</span>
                </div>
                <h2 className="font-poppins font-semibold text-xl">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-accent-green font-semibold mt-2">ID: {user.customId}</p>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent-green text-white">
                  <User className="w-5 h-5" />
                  <span className="font-poppins font-semibold">Informations</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Package className="w-5 h-5" />
                  <span className="font-poppins font-semibold">Mes commandes</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Star className="w-5 h-5" />
                  <span className="font-poppins font-semibold">Mes avis</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span className="font-poppins font-semibold">Paramètres</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <h2 className="text-2xl font-poppins font-semibold mb-6">Informations personnelles</h2>

              <form className="space-y-4">
                <Input label="Nom complet" value={user.name} />
                <Input label="Email" type="email" value={user.email} />
                <Input label="Téléphone" type="tel" value={user.phone} />
                <Input label="Adresse" value={user.address} />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Code postal" value={user.postalCode} />
                  <Input label="Ville" value={user.city} />
                </div>

                <Input label="Pays" value={user.country} />

                <Button variant="primary" type="submit">
                  Enregistrer les modifications
                </Button>
              </form>
            </Card>

            {/* Recent Orders */}
            <Card>
              <h2 className="text-2xl font-poppins font-semibold mb-6">Commandes récentes</h2>

              <div className="space-y-4">
                {userOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-poppins font-semibold">Commande #{order.trackingNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'shipped' ? 'info' :
                          order.status === 'confirmed' ? 'warning' :
                          'error'
                        }
                      >
                        {order.status === 'confirmed' ? 'Confirmée' :
                         order.status === 'shipped' ? 'Expédiée' :
                         order.status === 'delivered' ? 'Livrée' :
                         order.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.products.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.product.name} x{item.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-bold text-accent-green">
                        {order.total.toLocaleString('fr-FR')} FCFA
                      </span>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
