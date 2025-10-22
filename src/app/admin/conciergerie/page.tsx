'use client'

import React, { useState } from 'react'
import { Card, Button, Input, Modal, Badge } from '@/components/ui'
import { ConciergeRequest, Quote } from '@/types'
import {
  Search,
  Plus,
  FileText,
  Send,
  MessageSquare,
  Crown,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

// Données mockées pour la démonstration
const mockConciergeRequests: ConciergeRequest[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Marie Kouassi',
    userType: 'premium',
    productName: 'Montre Rolex Submariner',
    productDescription: 'Montre de luxe automatique, état neuf avec boîte et papiers',
    estimatedPrice: 15000000,
    status: 'pending',
    createdAt: '2024-10-08T10:00:00Z',
    updatedAt: '2024-10-08T10:00:00Z',
    notes: 'Client recherche modèle spécifique noir avec bracelet acier'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jean Baptiste',
    userType: 'standard',
    productName: 'MacBook Pro 16" M3',
    productDescription: 'Dernière version avec 32GB RAM et 1TB SSD',
    estimatedPrice: 4500000,
    status: 'quoted',
    createdAt: '2024-10-07T14:30:00Z',
    updatedAt: '2024-10-09T09:15:00Z',
    notes: 'Besoin urgent pour travail'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Aïcha Traoré',
    userType: 'premium',
    productName: 'Sac Hermès Birkin',
    productDescription: 'Sac à main en cuir véritable, couleur camel, taille 35cm',
    estimatedPrice: 25000000,
    status: 'negotiating',
    createdAt: '2024-10-05T08:20:00Z',
    updatedAt: '2024-10-09T16:45:00Z',
    notes: 'Cliente VIP - priorité haute'
  },
]

const mockQuotes: Quote[] = [
  {
    id: 'q1',
    conciergeRequestId: '2',
    originalPrice: 4500000,
    discount: 5,
    finalPrice: 4275000,
    validUntil: '2024-10-15T23:59:59Z',
    status: 'sent',
    createdAt: '2024-10-09T09:00:00Z',
    sentAt: '2024-10-09T09:15:00Z',
    notes: 'Réduction standard client'
  },
  {
    id: 'q2',
    conciergeRequestId: '3',
    originalPrice: 25000000,
    discount: 15,
    finalPrice: 21250000,
    validUntil: '2024-10-20T23:59:59Z',
    status: 'sent',
    createdAt: '2024-10-09T16:30:00Z',
    sentAt: '2024-10-09T16:45:00Z',
    notes: 'Réduction Premium 15%'
  },
]

export default function ConciergeriePage() {
  const [requests, setRequests] = useState<ConciergeRequest[]>(mockConciergeRequests)
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<ConciergeRequest | null>(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    originalPrice: 0,
    discount: 0,
    notes: ''
  })

  // Filtrer les demandes
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Calculer la réduction automatique selon le type d'abonnement
  const calculateAutoDiscount = (userType: 'standard' | 'premium') => {
    return userType === 'premium' ? 15 : 5
  }

  // Ouvrir le modal de création de devis
  const handleCreateQuote = (request: ConciergeRequest) => {
    setSelectedRequest(request)
    const autoDiscount = calculateAutoDiscount(request.userType)
    setQuoteForm({
      originalPrice: request.estimatedPrice || 0,
      discount: autoDiscount,
      notes: `Réduction automatique ${request.userType === 'premium' ? 'Premium' : 'Standard'}`
    })
    setShowQuoteModal(true)
  }

  // Envoyer le devis
  const handleSendQuote = () => {
    if (!selectedRequest) return

    const finalPrice = quoteForm.originalPrice * (1 - quoteForm.discount / 100)
    const newQuote: Quote = {
      id: `q${quotes.length + 1}`,
      conciergeRequestId: selectedRequest.id,
      originalPrice: quoteForm.originalPrice,
      discount: quoteForm.discount,
      finalPrice: finalPrice,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'sent',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      notes: quoteForm.notes
    }

    setQuotes([...quotes, newQuote])

    // Mettre à jour le statut de la demande
    setRequests(requests.map(req =>
      req.id === selectedRequest.id
        ? { ...req, status: 'quoted', updatedAt: new Date().toISOString() }
        : req
    ))

    setShowQuoteModal(false)
    setSelectedRequest(null)
  }

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeVariant = (status: ConciergeRequest['status']) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'quoted': return 'info'
      case 'negotiating': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'completed': return 'success'
      default: return 'info'
    }
  }

  const getStatusLabel = (status: ConciergeRequest['status']) => {
    const labels = {
      pending: 'En attente',
      quoted: 'Devis envoyé',
      negotiating: 'Négociation',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      completed: 'Terminé'
    }
    return labels[status]
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
          Service Conciergerie
        </h1>
        <p className="text-gray-600">Gestion des demandes Premium et création de devis</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-secondary">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Devis envoyés</p>
              <p className="text-2xl font-bold text-secondary">
                {requests.filter(r => r.status === 'quoted').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Négociations</p>
              <p className="text-2xl font-bold text-secondary">
                {requests.filter(r => r.status === 'negotiating').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-secondary">
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par produit ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="quoted">Devis envoyé</option>
            <option value="negotiating">Négociation</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
      </Card>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {filteredRequests.map(request => {
          const quote = quotes.find(q => q.conciergeRequestId === request.id)

          return (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        request.userType === 'premium' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {request.userType === 'premium' ? (
                          <Crown className="w-6 h-6 text-yellow-600" />
                        ) : (
                          <User className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-poppins font-semibold text-secondary">
                          {request.productName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {request.userName}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            request.userType === 'premium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {request.userType === 'premium' ? 'Premium' : 'Standard'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {getStatusLabel(request.status)}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3">{request.productDescription}</p>

                  {request.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    {request.estimatedPrice && (
                      <span className="flex items-center gap-1 font-semibold text-accent-green">
                        <DollarSign className="w-4 h-4" />
                        {request.estimatedPrice.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                </div>

                {/* Devis et actions */}
                <div className="lg:w-80 border-l pl-6">
                  {quote ? (
                    <div className="space-y-3">
                      <h4 className="font-poppins font-semibold text-secondary mb-3">Devis envoyé</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Prix original:</span>
                          <span className="font-semibold">{quote.originalPrice.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Réduction:</span>
                          <span className="font-semibold text-accent-green">{quote.discount}%</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="text-sm font-semibold">Prix final:</span>
                          <span className="font-bold text-lg text-accent-green">
                            {quote.finalPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Valide jusqu'au {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Négocier
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="font-poppins font-semibold text-secondary mb-3">Actions</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Réduction automatique: <strong>{calculateAutoDiscount(request.userType)}%</strong>
                        {request.userType === 'premium' && (
                          <span className="block text-yellow-600 mt-1">Client Premium</span>
                        )}
                      </p>
                      <Button
                        onClick={() => handleCreateQuote(request)}
                        className="w-full"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Créer un devis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Modal de création de devis */}
      <Modal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        title="Créer un devis"
      >
        <div className="space-y-4">
          {selectedRequest && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold">{selectedRequest.userName}</p>
                <p className="text-sm text-gray-600 mt-2">Produit</p>
                <p className="font-semibold">{selectedRequest.productName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix original (FCFA)
                </label>
                <Input
                  type="number"
                  value={quoteForm.originalPrice}
                  onChange={(e) => setQuoteForm({ ...quoteForm, originalPrice: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réduction (%)
                </label>
                <Input
                  type="number"
                  value={quoteForm.discount}
                  onChange={(e) => setQuoteForm({ ...quoteForm, discount: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Réduction recommandée: {calculateAutoDiscount(selectedRequest.userType)}%
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Prix final</p>
                <p className="text-2xl font-bold text-accent-green">
                  {(quoteForm.originalPrice * (1 - quoteForm.discount / 100)).toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
                  rows={3}
                  placeholder="Ajouter des notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowQuoteModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleSendQuote} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le devis
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
