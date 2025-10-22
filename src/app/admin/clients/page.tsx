'use client'

import React, { useState } from 'react'
import { mockUsers, mockOrders } from '@/data/mockData'
import { Card, Input, Button, Modal } from '@/components/ui'
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone, MapPin } from 'lucide-react'

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Calculer les statistiques pour chaque client
  const clientsWithStats = mockUsers.map(user => {
    const userOrders = mockOrders.filter(order => order.userId === user.id)
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)
    return {
      ...user,
      ordersCount: userOrders.length,
      totalSpent
    }
  })

  const filteredClients = clientsWithStats.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.customId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
          Gestion des Clients
        </h1>
        <p className="text-gray-600">Gérez tous les clients de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Clients</p>
              <p className="text-2xl font-bold text-secondary">{mockUsers.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Commandes Totales</p>
              <p className="text-2xl font-bold text-secondary">{mockOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Revenus Clients</p>
              <p className="text-2xl font-bold text-secondary">
                {mockOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
            />
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent-green hover:bg-accent-green/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </Card>

      {/* Clients Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">ID</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Nom</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Téléphone</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Ville</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Commandes</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Total Dépensé</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-gray-600">{client.customId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-poppins font-medium text-secondary">{client.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">{client.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">{client.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">{client.city}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {client.ordersCount}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-accent-green">
                      {client.totalSpent.toLocaleString('fr-FR')} FCFA
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewClient(client)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun client trouvé</p>
            </div>
          )}
        </div>
      </Card>

      {/* Client Details Modal */}
      {selectedClient && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Détails du Client">
          <div className="space-y-6">
            {/* Client Info */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">Informations Personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID Client</p>
                  <p className="font-mono font-medium">{selectedClient.customId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nom Complet</p>
                  <p className="font-medium">{selectedClient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">Adresse</h3>
              <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">{selectedClient.address}</p>
                  <p className="text-sm text-gray-600">
                    {selectedClient.city}, {selectedClient.country}
                  </p>
                  <p className="text-sm text-gray-600">Code Postal: {selectedClient.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Commandes</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedClient.ordersCount}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Dépensé</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedClient.totalSpent.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Users(props: any) {
  return <span {...props}>👥</span>
}

function ShoppingCart(props: any) {
  return <span {...props}>🛒</span>
}

function DollarSign(props: any) {
  return <span {...props}>💰</span>
}
