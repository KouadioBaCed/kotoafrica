'use client'

import React, { useState } from 'react'
import { Card, Button, Input, Modal, Badge } from '@/components/ui'
import { Incident } from '@/types'
import {
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Phone,
  User,
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  Edit,
  Send,
  Filter
} from 'lucide-react'

// Icône WhatsApp personnalisée
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Données mockées pour la démonstration
const mockIncidents: Incident[] = [
  {
    id: '1',
    orderId: 'KA-2024-001',
    userId: 'user1',
    userName: 'Marie Kouassi',
    type: 'delivery',
    priority: 'high',
    status: 'open',
    subject: 'Colis non reçu',
    description: 'Le colis devait arriver il y a 5 jours mais je ne l\'ai toujours pas reçu. Le tracking indique livré mais rien reçu.',
    whatsappNumber: '+225 07 12 34 56 78',
    createdAt: '2024-10-08T14:30:00Z',
    updatedAt: '2024-10-08T14:30:00Z'
  },
  {
    id: '2',
    orderId: 'KA-2024-015',
    userId: 'user2',
    userName: 'Jean Baptiste',
    type: 'product',
    priority: 'medium',
    status: 'in_progress',
    subject: 'Produit endommagé',
    description: 'Le produit est arrivé avec un emballage déchiré et présente des dommages visibles.',
    whatsappNumber: '+225 05 98 76 54 32',
    createdAt: '2024-10-07T09:15:00Z',
    updatedAt: '2024-10-09T11:20:00Z',
    assignedTo: 'Admin Support'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Aïcha Traoré',
    type: 'payment',
    priority: 'urgent',
    status: 'in_progress',
    subject: 'Problème de paiement',
    description: 'J\'ai effectué le paiement mais ma commande n\'est pas confirmée. Le montant a été débité de mon compte.',
    whatsappNumber: '+225 01 23 45 67 89',
    createdAt: '2024-10-09T16:45:00Z',
    updatedAt: '2024-10-10T08:30:00Z',
    assignedTo: 'Finance Team'
  },
  {
    id: '4',
    orderId: 'KA-2024-032',
    userId: 'user4',
    userName: 'Kofi Mensah',
    type: 'other',
    priority: 'low',
    status: 'resolved',
    subject: 'Question sur la livraison',
    description: 'Je souhaite modifier l\'adresse de livraison avant l\'expédition.',
    whatsappNumber: '+225 07 88 99 00 11',
    createdAt: '2024-10-05T10:00:00Z',
    updatedAt: '2024-10-06T14:30:00Z',
    resolvedAt: '2024-10-06T14:30:00Z',
    assignedTo: 'Logistics Team',
    resolution: 'Adresse modifiée avec succès avant expédition'
  },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [resolution, setResolution] = useState('')

  // Filtrer les incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch =
      incident.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.orderId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus
    const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Statistiques
  const stats = {
    open: incidents.filter(i => i.status === 'open').length,
    inProgress: incidents.filter(i => i.status === 'in_progress').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    urgent: incidents.filter(i => i.priority === 'urgent').length,
  }

  // Ouvrir WhatsApp
  const handleOpenWhatsApp = (phoneNumber: string, message?: string) => {
    const formattedNumber = phoneNumber.replace(/[\s\+]/g, '')
    const encodedMessage = message ? encodeURIComponent(message) : ''
    const url = `https://wa.me/${formattedNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`
    window.open(url, '_blank')
  }

  // Résoudre un incident
  const handleResolve = () => {
    if (!selectedIncident) return

    setIncidents(incidents.map(i =>
      i.id === selectedIncident.id
        ? {
            ...i,
            status: 'resolved',
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolution: resolution
          }
        : i
    ))

    setShowModal(false)
    setSelectedIncident(null)
    setResolution('')
  }

  // Changer le statut
  const handleStatusChange = (id: string, status: Incident['status']) => {
    setIncidents(incidents.map(i =>
      i.id === id
        ? { ...i, status, updatedAt: new Date().toISOString() }
        : i
    ))
  }

  // Obtenir la couleur du badge selon le statut
  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'open': return <Badge variant="warning">Ouvert</Badge>
      case 'in_progress': return <Badge variant="info">En cours</Badge>
      case 'resolved': return <Badge variant="success">Résolu</Badge>
      case 'closed': return <Badge>Fermé</Badge>
      default: return <Badge>Inconnu</Badge>
    }
  }

  // Obtenir la couleur du badge selon la priorité
  const getPriorityBadge = (priority: Incident['priority']) => {
    switch (priority) {
      case 'urgent': return <Badge variant="error">Urgent</Badge>
      case 'high': return <Badge variant="warning">Haute</Badge>
      case 'medium': return <Badge variant="info">Moyenne</Badge>
      case 'low': return <Badge>Basse</Badge>
      default: return <Badge>Inconnu</Badge>
    }
  }

  // Obtenir l'icône du type
  const getTypeIcon = (type: Incident['type']) => {
    switch (type) {
      case 'delivery': return <Package className="w-5 h-5" />
      case 'product': return <AlertCircle className="w-5 h-5" />
      case 'payment': return <DollarSign className="w-5 h-5" />
      case 'other': return <MessageCircle className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
          Gestion des Incidents
        </h1>
        <p className="text-gray-600">Suivi et résolution des incidents clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ouverts</p>
              <p className="text-2xl font-bold text-secondary">{stats.open}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-secondary">{stats.inProgress}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-secondary">{stats.resolved}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgents</p>
              <p className="text-2xl font-bold text-secondary">{stats.urgent}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par client, commande ou sujet..."
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
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </Card>

      {/* Liste des incidents */}
      <div className="space-y-4">
        {filteredIncidents.map(incident => (
          <Card key={incident.id} className="hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      incident.priority === 'urgent' ? 'bg-red-100' :
                      incident.priority === 'high' ? 'bg-orange-100' :
                      incident.priority === 'medium' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {getTypeIcon(incident.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-poppins font-semibold text-secondary">
                        {incident.subject}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4" />
                        <span>{incident.userName}</span>
                        {incident.orderId && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Package className="w-4 h-4" />
                            <span>{incident.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(incident.status)}
                    {getPriorityBadge(incident.priority)}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{incident.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Créé le {new Date(incident.createdAt).toLocaleString('fr-FR')}
                  </span>
                  {incident.assignedTo && (
                    <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Assigné à: {incident.assignedTo}
                    </span>
                  )}
                </div>

                {incident.resolution && (
                  <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 mb-1">Résolution:</p>
                    <p className="text-sm text-green-700">{incident.resolution}</p>
                    {incident.resolvedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        Résolu le {new Date(incident.resolvedAt).toLocaleString('fr-FR')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="lg:w-64 border-l pl-6 flex flex-col gap-3">
                {incident.whatsappNumber && (
                  <Button
                    onClick={() => handleOpenWhatsApp(
                      incident.whatsappNumber!,
                      `Bonjour ${incident.userName}, nous avons bien reçu votre demande concernant: ${incident.subject}. Comment pouvons-nous vous aider?`
                    )}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <WhatsAppIcon />
                    <span className="ml-2">Contacter sur WhatsApp</span>
                  </Button>
                )}

                {incident.status !== 'resolved' && incident.status !== 'closed' && (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedIncident(incident)
                        setShowModal(true)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Résoudre
                    </Button>

                    <select
                      value={incident.status}
                      onChange={(e) => handleStatusChange(incident.id, e.target.value as Incident['status'])}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green text-sm"
                    >
                      <option value="open">Ouvert</option>
                      <option value="in_progress">En cours</option>
                      <option value="resolved">Résolu</option>
                      <option value="closed">Fermé</option>
                    </select>
                  </>
                )}

                <div className="mt-auto pt-4 border-t text-xs text-gray-500">
                  <p>Mis à jour:</p>
                  <p>{new Date(incident.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de résolution */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Résoudre l'incident"
      >
        <div className="space-y-4">
          {selectedIncident && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold">{selectedIncident.userName}</p>
                <p className="text-sm text-gray-600 mt-2">Sujet</p>
                <p className="font-semibold">{selectedIncident.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résolution / Notes
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
                  rows={5}
                  placeholder="Décrivez la résolution de l'incident..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleResolve} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer comme résolu
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
