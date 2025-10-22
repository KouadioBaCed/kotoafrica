'use client'

import React, { useState } from 'react'
import { mockUsers, mockOrders } from '@/data/mockData'
import { User } from '@/types'
import { Card, Input, Button, Badge, Modal } from '@/components/ui'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Shield,
  ShieldCheck,
  Users as UsersIcon,
  Building2,
  Calendar,
  Clock
} from 'lucide-react'

export default function UtilisateursPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User>>({})

  // Calculer les statistiques
  const clientsCount = mockUsers.filter(u => u.role === 'client').length
  const adminsCount = mockUsers.filter(u => u.role === 'admin').length
  const fournisseursCount = mockUsers.filter(u => u.role.startsWith('fournisseur')).length
  const activeUsersCount = mockUsers.filter(u => u.status === 'active').length

  // Filtrer les utilisateurs
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.customId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrateur', color: 'bg-red-100 text-red-700' },
      client: { label: 'Client', color: 'bg-blue-100 text-blue-700' },
      fournisseur_afrique: { label: 'Fournisseur Afrique', color: 'bg-green-100 text-green-700' },
      fournisseur_asie: { label: 'Fournisseur Asie', color: 'bg-orange-100 text-orange-700' },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.client
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
      inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-700' },
      suspended: { label: 'Suspendu', color: 'bg-red-100 text-red-700' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditForm(user)
    setIsEditModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">Gérez tous les utilisateurs et leurs accès sur la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-secondary">{mockUsers.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Clients</p>
              <p className="text-2xl font-bold text-secondary">{clientsCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Administrateurs</p>
              <p className="text-2xl font-bold text-secondary">{adminsCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Fournisseurs</p>
              <p className="text-2xl font-bold text-secondary">{fournisseursCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
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

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="client">Clients</option>
              <option value="fournisseur_afrique">Fournisseurs Afrique</option>
              <option value="fournisseur_asie">Fournisseurs Asie</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent-green hover:bg-accent-green/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">ID</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Utilisateur</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Contact</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Rôle</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Statut</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Dernière Connexion</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-gray-600">{user.customId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-poppins font-medium text-secondary">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.city}, {user.country}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </Card>

      {/* View User Modal */}
      {selectedUser && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Détails de l'Utilisateur"
        >
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-poppins font-bold text-secondary">{selectedUser.name}</h3>
                <p className="text-gray-600 font-mono text-sm">{selectedUser.customId}</p>
              </div>
              <div className="space-y-2">
                {getRoleBadge(selectedUser.role)}
                {getStatusBadge(selectedUser.status)}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-poppins font-semibold text-lg mb-3">Informations de Contact</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium">{selectedUser.address}</p>
                    <p className="text-sm text-gray-600">
                      {selectedUser.city}, {selectedUser.country} - {selectedUser.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Info */}
            <div>
              <h4 className="font-poppins font-semibold text-lg mb-3">Activité</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-gray-600">Inscrit le</p>
                  </div>
                  <p className="font-semibold text-blue-700">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-gray-600">Dernière Connexion</p>
                  </div>
                  <p className="font-semibold text-green-700">
                    {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Jamais'}
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="font-poppins font-semibold text-lg mb-3">Accès et Permissions</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent-green mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-secondary mb-2">Rôle: {getRoleBadge(selectedUser.role)}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      {selectedUser.role === 'admin' && (
                        <>
                          <p>✓ Accès complet au back office</p>
                          <p>✓ Gestion des utilisateurs</p>
                          <p>✓ Gestion des produits et commandes</p>
                          <p>✓ Gestion des fournisseurs</p>
                        </>
                      )}
                      {selectedUser.role === 'client' && (
                        <>
                          <p>✓ Passer des commandes</p>
                          <p>✓ Consulter l'historique</p>
                          <p>✓ Gérer son profil</p>
                        </>
                      )}
                      {selectedUser.role.startsWith('fournisseur') && (
                        <>
                          <p>✓ Gérer ses produits</p>
                          <p>✓ Consulter ses commandes</p>
                          <p>✓ Gérer son inventaire</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier l'Utilisateur"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
              <Input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <Input
                value={editForm.city || ''}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <Input
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                value={editForm.role || ''}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
              >
                <option value="client">Client</option>
                <option value="admin">Administrateur</option>
                <option value="fournisseur_afrique">Fournisseur Afrique</option>
                <option value="fournisseur_asie">Fournisseur Asie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={editForm.status || ''}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" className="flex-1 bg-accent-green hover:bg-accent-green/90">
              Enregistrer
            </Button>
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add User Modal - Similar structure */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Nouvel Utilisateur"
      >
        <p className="text-gray-600 mb-4">Formulaire de création d'utilisateur à implémenter</p>
        <Button onClick={() => setIsAddModalOpen(false)} className="w-full">
          Fermer
        </Button>
      </Modal>
    </div>
  )
}
