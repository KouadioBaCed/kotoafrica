'use client'

import React, { useState } from 'react'
import { mockSuppliers, mockProducts } from '@/data/mockData'
import { Card, Input, Button, Badge, Modal } from '@/components/ui'
import { Search, Plus, Edit, Trash2, Eye, Star, Package, Globe, CheckCircle, XCircle } from 'lucide-react'

export default function FournisseursPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'african' | 'asian'>('all')
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Calculer les stats pour chaque fournisseur
  const suppliersWithStats = mockSuppliers.map(supplier => {
    const supplierProducts = mockProducts.filter(p => p.supplier.id === supplier.id)
    const totalStock = supplierProducts.reduce((sum, p) => sum + p.stock, 0)
    const avgRating = supplierProducts.reduce((sum, p) => sum + p.rating, 0) / (supplierProducts.length || 1)

    return {
      ...supplier,
      actualProductsCount: supplierProducts.length,
      totalStock,
      avgProductRating: avgRating
    }
  })

  const filteredSuppliers = suppliersWithStats.filter(supplier => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || supplier.type === filterType
    return matchesSearch && matchesType
  })

  const handleViewSupplier = (supplier: any) => {
    setSelectedSupplier(supplier)
    setIsModalOpen(true)
  }

  const africanSuppliersCount = mockSuppliers.filter(s => s.type === 'african').length
  const asianSuppliersCount = mockSuppliers.filter(s => s.type === 'asian').length
  const verifiedCount = mockSuppliers.filter(s => s.verified).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
          Gestion des Fournisseurs
        </h1>
        <p className="text-gray-600">Gérez tous les fournisseurs de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Building2Icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Fournisseurs</p>
              <p className="text-2xl font-bold text-secondary">{mockSuppliers.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Fournisseurs Africains</p>
              <p className="text-2xl font-bold text-secondary">{africanSuppliersCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Fournisseurs Asiatiques</p>
              <p className="text-2xl font-bold text-secondary">{asianSuppliersCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Vérifiés</p>
              <p className="text-2xl font-bold text-secondary">{verifiedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, pays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
            >
              <option value="all">Tous les types</option>
              <option value="african">Africains</option>
              <option value="asian">Asiatiques</option>
            </select>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent-green hover:bg-accent-green/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Fournisseur
          </Button>
        </div>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-poppins font-semibold text-secondary">
                    {supplier.name}
                  </h3>
                  {supplier.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" title="Vérifié" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Globe className="w-4 h-4" />
                  <span>{supplier.country}</span>
                </div>
                <Badge
                  variant={supplier.type === 'african' ? 'default' : 'secondary'}
                  className={supplier.type === 'african' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}
                >
                  {supplier.type === 'african' ? 'Afrique' : 'Asie'}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>Note</span>
                </div>
                <span className="font-semibold text-secondary">{supplier.rating.toFixed(1)}/5</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Produits</span>
                </div>
                <span className="font-semibold text-secondary">{supplier.actualProductsCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Stock Total</span>
                </div>
                <span className="font-semibold text-secondary">{supplier.totalStock}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleViewSupplier(supplier)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Voir
              </button>
              <button
                className="flex-1 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun fournisseur trouvé</p>
          </div>
        </Card>
      )}

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Détails du Fournisseur">
          <div className="space-y-6">
            {/* Supplier Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-poppins font-semibold text-2xl">{selectedSupplier.name}</h3>
                {selectedSupplier.verified && (
                  <CheckCircle className="w-6 h-6 text-green-500" title="Vérifié" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pays</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{selectedSupplier.country}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <Badge
                    variant={selectedSupplier.type === 'african' ? 'default' : 'secondary'}
                    className={selectedSupplier.type === 'african' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}
                  >
                    {selectedSupplier.type === 'african' ? 'Fournisseur Africain' : 'Fournisseur Asiatique'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-sm text-gray-600">Note Moyenne</p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{selectedSupplier.rating.toFixed(1)}/5</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-gray-600">Produits</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{selectedSupplier.actualProductsCount}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Stock Total</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{selectedSupplier.totalStock}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-600">Note Produits</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{selectedSupplier.avgProductRating.toFixed(1)}/5</p>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">Produits du Fournisseur</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {mockProducts
                  .filter(p => p.supplier.id === selectedSupplier.id)
                  .map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent-green">{product.price.toLocaleString('fr-FR')} FCFA</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Building2Icon(props: any) {
  return <span {...props}>🏢</span>
}
