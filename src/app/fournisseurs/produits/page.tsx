'use client'

import React from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { mockProducts } from '@/data/mockData'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function FournisseurProduitsPage() {
  const supplierId = '1'
  const myProducts = mockProducts.filter(p => p.supplier.id === supplierId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-montserrat font-extrabold text-secondary">
                Mon Catalogue
              </h1>
              <p className="text-gray-600">{myProducts.length} produits</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map(product => (
            <Card key={product.id}>
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">Image produit</span>
              </div>

              <h3 className="font-poppins font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-accent-green">
                    {product.price.toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                </div>
                <Badge variant={product.stock > 10 ? 'success' : 'warning'}>
                  {product.stock > 10 ? 'En stock' : 'Stock faible'}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Voir
                </Button>
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Éditer
                </Button>
                <button className="p-2 hover:bg-red-50 rounded text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
