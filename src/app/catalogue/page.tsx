'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout'
import { ProductCard } from '@/components/products/ProductCard'
import { Input } from '@/components/ui'
import { mockProducts } from '@/data/mockData'
import { Filter, Search, X } from 'lucide-react'

export default function CataloguePage() {
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('popularity')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

  const categories = ['Artisanat', 'Textile', 'Électronique', 'Mode', 'Décoration']

  const filteredProducts = mockProducts.filter(product => {
    if (selectedOrigin !== 'all' && product.origin !== selectedOrigin) return false
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-montserrat font-extrabold text-secondary mb-8">
          Catalogue Produits
        </h1>

        {/* Mobile Search and Filter Bar */}
        <div className="lg:hidden mb-6">
          <div className="flex gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-3 bg-accent-green text-white rounded-lg flex items-center gap-2 hover:bg-accent-green/90 transition-colors"
            >
              {isFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              <span className="font-medium">Filtres</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-accent-green" />
                  <h2 className="font-poppins font-semibold text-lg">Filtres</h2>
                </div>
                {/* Close button for mobile */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden lg:block mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Origin Filter */}
              <div className="mb-6">
                <h3 className="font-poppins font-semibold mb-3">Origine</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="origin"
                      value="all"
                      checked={selectedOrigin === 'all'}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                      className="accent-accent-green"
                    />
                    <span>Tous</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="origin"
                      value="africa"
                      checked={selectedOrigin === 'africa'}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                      className="accent-accent-green"
                    />
                    <span>Afrique</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="origin"
                      value="asia"
                      checked={selectedOrigin === 'asia'}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                      className="accent-accent-green"
                    />
                    <span>Asie</span>
                  </label>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-poppins font-semibold mb-3">Catégorie</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="accent-accent-green"
                    />
                    <span>Toutes</span>
                  </label>
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="accent-accent-green"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-poppins font-semibold mb-3">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
                >
                  <option value="popularity">Popularité</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces filtres</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
