'use client'

import React, { useState } from 'react'
import { Card, Button, Badge, Input } from '@/components/ui'
import { mockProducts } from '@/data/mockData'
import { Search, Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react'

export default function AdminProduitsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-montserrat font-extrabold text-secondary">
                Gestion des Produits
              </h1>
              <p className="text-gray-600">{mockProducts.length} produits au total</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Produit</th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Catégorie</th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Prix</th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Origine</th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <p className="font-poppins font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.supplier.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="info">{product.category}</Badge>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-4 px-4">
                      <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={product.origin === 'africa' ? 'success' : 'info'}>
                        {product.origin === 'africa' ? 'Afrique' : 'Asie'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="success">Actif</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-yellow-50 rounded text-yellow-600">
                          <PowerOff className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
