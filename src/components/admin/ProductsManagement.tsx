import React, { useState } from 'react'
import { products } from '../../data/products'
import { Card, Input, Button, Badge, Modal } from '../ui'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Globe,
  Tag,
  DollarSign,
  Clock,
  Weight,
  Image as ImageIcon,
  PackagePlus
} from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  origin: 'africa' | 'asia'
  stock_quantity: number
  delivery_days: number
  weight_kg: number
  volume_m3: number
  images: string[]
  is_available: boolean
}

export function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterOrigin, setFilterOrigin] = useState<string>('all')
  const [filterAvailability, setFilterAvailability] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [createForm, setCreateForm] = useState<Partial<Product>>({
    origin: 'africa',
    is_available: true
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Categories
  const categories = ['Textile', 'Vêtements', 'Accessoires', 'Électronique', 'Maison', 'Art & Déco']

  // Calculer les statistiques
  const africaCount = products.filter(p => p.origin === 'africa').length
  const asiaCount = products.filter(p => p.origin === 'asia').length
  const availableCount = products.filter(p => p.is_available).length

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesOrigin = filterOrigin === 'all' || product.origin === filterOrigin
    const matchesAvailability = filterAvailability === 'all' ||
      (filterAvailability === 'available' && product.is_available) ||
      (filterAvailability === 'unavailable' && !product.is_available)

    return matchesSearch && matchesCategory && matchesOrigin && matchesAvailability
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Réinitialiser la page quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterCategory, filterOrigin, filterAvailability])

  const getOriginBadge = (origin: string) => {
    const config = {
      africa: { label: 'Afrique', color: 'bg-green-100 text-green-700' },
      asia: { label: 'Asie', color: 'bg-orange-100 text-orange-700' },
    }
    const badge = config[origin as keyof typeof config]
    return <Badge className={badge.color}>{badge.label}</Badge>
  }

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge className="bg-green-100 text-green-700">Disponible</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700">Indisponible</Badge>
    )
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditForm(product)
    setIsEditModalOpen(true)
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Produits</p>
              <p className="text-2xl font-bold text-secondary">{products.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Afrique</p>
              <p className="text-2xl font-bold text-secondary">{africaCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Asie</p>
              <p className="text-2xl font-bold text-secondary">{asiaCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Disponibles</p>
              <p className="text-2xl font-bold text-secondary">{availableCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[160px]">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Origin Filter */}
            <div className="relative min-w-[140px]">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="all">Toutes origines</option>
                <option value="africa">Afrique</option>
                <option value="asia">Asie</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="relative min-w-[160px]">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="unavailable">Indisponible</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1BAA70] hover:bg-[#1BAA70]/90 text-white rounded-lg transition-colors font-poppins text-sm font-medium whitespace-nowrap"
          >
            <PackagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau Produit</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
      </Card>

      {/* Products Table - Desktop */}
      <Card className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Produit</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Catégorie</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Prix</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Origine</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Statut</th>
                <th className="text-left py-4 px-4 font-poppins font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-poppins font-medium text-secondary">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.description.substring(0, 40)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[#1BAA70]">${product.price}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm ${product.stock_quantity > 50 ? 'text-green-600' : product.stock_quantity > 20 ? 'text-orange-600' : 'text-red-600'}`}>
                      {product.stock_quantity} unités
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getOriginBadge(product.origin)}
                  </td>
                  <td className="py-4 px-4">
                    {getAvailabilityBadge(product.is_available)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 pb-4">
            <div className="text-sm text-gray-600">
              Affichage de {startIndex + 1} à {Math.min(endIndex, filteredProducts.length)} sur {filteredProducts.length} produits
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-[#1BAA70] hover:bg-[#1BAA70]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins text-sm"
              >
                Précédent
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-[#1BAA70] text-white'
                        : 'border-2 border-gray-200 hover:border-[#1BAA70] hover:bg-[#1BAA70]/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-[#1BAA70] hover:bg-[#1BAA70]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins text-sm"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Products Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {paginatedProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="space-y-3">
              {/* Header with Image */}
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-secondary">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold text-[#1BAA70] mt-1">${product.price}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {getOriginBadge(product.origin)}
                {getAvailabilityBadge(product.is_available)}
                <Badge className="bg-gray-100 text-gray-700">{product.category}</Badge>
              </div>

              {/* Info */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Stock: {product.stock_quantity}</span>
                <span>Livraison: {product.delivery_days}j</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleViewProduct(product)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Voir
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                >
                  Modifier
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <Card className="p-12">
            <p className="text-center text-gray-500">Aucun produit trouvé</p>
          </Card>
        )}

        {/* Pagination Mobile */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="text-sm text-gray-600 text-center">
                Page {currentPage} sur {totalPages} ({filteredProducts.length} produits)
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#1BAA70] hover:bg-[#1BAA70]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins text-sm"
                >
                  Précédent
                </button>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#1BAA70] hover:bg-[#1BAA70]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins text-sm"
                >
                  Suivant
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* View Product Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Détails du Produit"
        >
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {selectedProduct.images[0] ? (
                  <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-poppins font-bold text-secondary">{selectedProduct.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{selectedProduct.description}</p>
                <div className="flex gap-2 mt-2">
                  {getOriginBadge(selectedProduct.origin)}
                  {getAvailabilityBadge(selectedProduct.is_available)}
                </div>
              </div>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600">Prix</p>
                </div>
                <p className="font-semibold text-green-700 text-lg">${selectedProduct.price}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600">Stock</p>
                </div>
                <p className="font-semibold text-blue-700">{selectedProduct.stock_quantity} unités</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <p className="text-sm text-gray-600">Livraison</p>
                </div>
                <p className="font-semibold text-purple-700">{selectedProduct.delivery_days} jours</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Weight className="w-4 h-4 text-orange-600" />
                  <p className="text-sm text-gray-600">Poids</p>
                </div>
                <p className="font-semibold text-orange-700">{selectedProduct.weight_kg} kg</p>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h4 className="font-poppins font-semibold text-lg mb-3">Informations supplémentaires</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Catégorie:</span> {selectedProduct.category}</p>
                <p><span className="font-medium">Volume:</span> {selectedProduct.volume_m3} m³</p>
                <p><span className="font-medium">Images:</span> {selectedProduct.images.length} photo(s)</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le Produit"
      >
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          alert('Fonctionnalité de modification (front-end uniquement)')
          setIsEditModalOpen(false)
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
              <Input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix ($)</label>
              <Input
                type="number"
                step="0.01"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <Input
                type="number"
                value={editForm.stock_quantity || ''}
                onChange={(e) => setEditForm({ ...editForm, stock_quantity: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={editForm.category || ''}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origine</label>
              <select
                value={editForm.origin || ''}
                onChange={(e) => setEditForm({ ...editForm, origin: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              >
                <option value="africa">Afrique</option>
                <option value="asia">Asie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Livraison (jours)</label>
              <Input
                type="number"
                value={editForm.delivery_days || ''}
                onChange={(e) => setEditForm({ ...editForm, delivery_days: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
              <select
                value={editForm.is_available ? 'true' : 'false'}
                onChange={(e) => setEditForm({ ...editForm, is_available: e.target.value === 'true' })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              >
                <option value="true">Disponible</option>
                <option value="false">Indisponible</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-[#1BAA70] hover:bg-[#1BAA70]/90">
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

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setCreateForm({ origin: 'africa', is_available: true })
        }}
        title="Créer un Nouveau Produit"
      >
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          alert('Fonctionnalité de création (front-end uniquement)')
          setIsCreateModalOpen(false)
          setCreateForm({ origin: 'africa', is_available: true })
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
              <Input
                required
                value={createForm.name || ''}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Ex: Tissu en coton africain"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={createForm.description || ''}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
                placeholder="Description détaillée du produit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix ($)</label>
              <Input
                type="number"
                step="0.01"
                required
                value={createForm.price || ''}
                onChange={(e) => setCreateForm({ ...createForm, price: parseFloat(e.target.value) })}
                placeholder="19.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <Input
                type="number"
                required
                value={createForm.stock_quantity || ''}
                onChange={(e) => setCreateForm({ ...createForm, stock_quantity: parseInt(e.target.value) })}
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                required
                value={createForm.category || ''}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              >
                <option value="">Sélectionner...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origine</label>
              <select
                value={createForm.origin || 'africa'}
                onChange={(e) => setCreateForm({ ...createForm, origin: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              >
                <option value="africa">Afrique</option>
                <option value="asia">Asie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Livraison (jours)</label>
              <Input
                type="number"
                required
                value={createForm.delivery_days || ''}
                onChange={(e) => setCreateForm({ ...createForm, delivery_days: parseInt(e.target.value) })}
                placeholder="7"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <Input
                type="number"
                step="0.1"
                required
                value={createForm.weight_kg || ''}
                onChange={(e) => setCreateForm({ ...createForm, weight_kg: parseFloat(e.target.value) })}
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
              <Input
                type="number"
                step="0.001"
                required
                value={createForm.volume_m3 || ''}
                onChange={(e) => setCreateForm({ ...createForm, volume_m3: parseFloat(e.target.value) })}
                placeholder="0.003"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
              <select
                value={createForm.is_available ? 'true' : 'false'}
                onChange={(e) => setCreateForm({ ...createForm, is_available: e.target.value === 'true' })}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#1BAA70] focus:outline-none text-sm"
              >
                <option value="true">Disponible</option>
                <option value="false">Indisponible</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-[#1BAA70] hover:bg-[#1BAA70]/90">
              Créer le produit
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false)
                setCreateForm({ origin: 'africa', is_available: true })
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
