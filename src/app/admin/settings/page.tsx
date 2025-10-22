'use client'

import React, { useState } from 'react'
import { Card, Button, Input, Modal, Badge } from '@/components/ui'
import { PremiumSettings } from '@/types'
import {
  Crown,
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle,
  DollarSign,
  Percent,
  Gift,
  Settings as SettingsIcon
} from 'lucide-react'

// Données mockées pour la démonstration
const mockPremiumSettings: PremiumSettings[] = [
  {
    id: '1',
    tierName: 'Premium Silver',
    discountPercentage: 10,
    monthlyFee: 25000,
    benefits: [
      'Réduction de 10% sur toutes les commandes',
      'Support prioritaire 24/7',
      'Livraison express gratuite',
      'Accès anticipé aux nouveaux produits'
    ],
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-01T14:30:00Z'
  },
  {
    id: '2',
    tierName: 'Premium Gold',
    discountPercentage: 15,
    monthlyFee: 45000,
    benefits: [
      'Réduction de 15% sur toutes les commandes',
      'Support VIP dédié 24/7',
      'Livraison express gratuite',
      'Accès anticipé aux nouveaux produits',
      'Service conciergerie illimité',
      'Programme fidélité exclusif',
      'Retours gratuits sous 30 jours'
    ],
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-01T14:30:00Z'
  },
  {
    id: '3',
    tierName: 'Premium Platinum',
    discountPercentage: 20,
    monthlyFee: 75000,
    benefits: [
      'Réduction de 20% sur toutes les commandes',
      'Manager de compte personnel',
      'Livraison express gratuite',
      'Accès anticipé aux nouveaux produits',
      'Service conciergerie premium illimité',
      'Programme fidélité exclusif',
      'Retours gratuits sous 60 jours',
      'Événements VIP exclusifs',
      'Cadeaux personnalisés'
    ],
    active: false,
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-08-15T16:20:00Z'
  },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<PremiumSettings[]>(mockPremiumSettings)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PremiumSettings | null>(null)
  const [formData, setFormData] = useState<Partial<PremiumSettings>>({
    tierName: '',
    discountPercentage: 0,
    monthlyFee: 0,
    benefits: [],
    active: true
  })
  const [newBenefit, setNewBenefit] = useState('')

  // Ouvrir le modal pour créer ou modifier
  const handleOpenModal = (item?: PremiumSettings) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData({
        tierName: '',
        discountPercentage: 0,
        monthlyFee: 0,
        benefits: [],
        active: true
      })
    }
    setShowModal(true)
  }

  // Sauvegarder les modifications
  const handleSave = () => {
    if (editingItem) {
      // Modifier
      setSettings(settings.map(s =>
        s.id === editingItem.id
          ? { ...s, ...formData, updatedAt: new Date().toISOString() }
          : s
      ))
    } else {
      // Créer
      const newSetting: PremiumSettings = {
        id: `${settings.length + 1}`,
        tierName: formData.tierName || '',
        discountPercentage: formData.discountPercentage || 0,
        monthlyFee: formData.monthlyFee || 0,
        benefits: formData.benefits || [],
        active: formData.active || true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setSettings([...settings, newSetting])
    }
    setShowModal(false)
    setEditingItem(null)
  }

  // Supprimer un paramètre
  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre Premium ?')) {
      setSettings(settings.filter(s => s.id !== id))
    }
  }

  // Activer/Désactiver une offre
  const handleToggleActive = (id: string) => {
    setSettings(settings.map(s =>
      s.id === id
        ? { ...s, active: !s.active, updatedAt: new Date().toISOString() }
        : s
    ))
  }

  // Ajouter un avantage
  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), newBenefit.trim()]
      })
      setNewBenefit('')
    }
  }

  // Supprimer un avantage
  const handleRemoveBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: (formData.benefits || []).filter((_, i) => i !== index)
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
            Paramètres Premium
          </h1>
          <p className="text-gray-600">Configuration des offres et abonnements Premium</p>
        </div>

        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Offre
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Offres Actives</p>
              <p className="text-3xl font-bold text-secondary">
                {settings.filter(s => s.active).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Offres</p>
              <p className="text-3xl font-bold text-secondary">{settings.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
              <Percent className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Réduction Max</p>
              <p className="text-3xl font-bold text-secondary">
                {Math.max(...settings.map(s => s.discountPercentage))}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des offres */}
      <div className="space-y-6">
        {settings.map(setting => (
          <Card key={setting.id} className={`relative ${!setting.active ? 'opacity-60' : ''}`}>
            {/* Badge statut */}
            {setting.active && (
              <div className="absolute top-4 right-4">
                <Badge variant="success">Active</Badge>
              </div>
            )}
            {!setting.active && (
              <div className="absolute top-4 right-4">
                <Badge variant="error">Inactive</Badge>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations principales */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-poppins font-bold text-secondary mb-2">
                      {setting.tierName}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <Percent className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          {setting.discountPercentage}% de réduction
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-800">
                          {setting.monthlyFee.toLocaleString('fr-FR')} FCFA/mois
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avantages */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-poppins font-semibold text-secondary mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Avantages inclus
                  </h4>
                  <ul className="space-y-2">
                    {setting.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleOpenModal(setting)}
                  variant="outline"
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>

                <Button
                  onClick={() => handleToggleActive(setting.id)}
                  variant="outline"
                  className="w-full"
                >
                  {setting.active ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Désactiver
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activer
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleDelete(setting.id)}
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>

                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  <p>Créé le: {new Date(setting.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p>Modifié le: {new Date(setting.updatedAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de création/modification */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? 'Modifier l\'offre Premium' : 'Créer une nouvelle offre Premium'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'offre
            </label>
            <Input
              type="text"
              value={formData.tierName}
              onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
              placeholder="Ex: Premium Gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réduction (%)
              </label>
              <Input
                type="number"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix mensuel (FCFA)
              </label>
              <Input
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avantages
            </label>
            <div className="space-y-2 mb-3">
              {(formData.benefits || []).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="flex-1 text-sm">{benefit}</span>
                  <button
                    onClick={() => handleRemoveBenefit(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
                placeholder="Ajouter un avantage..."
                className="flex-1"
              />
              <Button type="button" onClick={handleAddBenefit} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-accent-green focus:ring-accent-green border-gray-300 rounded"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Offre active
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
