'use client'

import React from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { Card } from '../ui'
import { Star, ShoppingCart, MapPin, Clock } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card hover className="h-full flex flex-col">
      <Link href={`/produits/${product.id}`}>
        <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Image produit
          </div>
          <div className="absolute top-2 right-2 bg-primary px-2 py-1 rounded text-xs font-semibold">
            {product.origin === 'africa' ? '🌍 Afrique' : '🌏 Asie'}
          </div>
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <Link href={`/produits/${product.id}`}>
          <h3 className="font-poppins font-semibold text-lg text-secondary mb-2 hover:text-accent-green transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{product.country}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          <span>Livraison: {product.deliveryTime} jours</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-accent-green">
                {product.price.toLocaleString('fr-FR')} FCFA
              </p>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>
          </div>

          <button className="w-full btn-primary flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </Card>
  )
}
