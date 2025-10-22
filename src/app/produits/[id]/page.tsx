'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import { mockProducts, mockReviews } from '@/data/mockData'
import { Star, ShoppingCart, MapPin, Clock, Package, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const product = mockProducts.find(p => p.id === params.id)
  const productReviews = mockReviews.filter(r => r.productId === params.id)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Produit non trouvé</h1>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="relative h-96 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <Package className="w-24 h-24 mx-auto mb-2" />
                <p>Image produit {selectedImage + 1}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center ${
                    selectedImage === index ? 'ring-2 ring-accent-green' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge variant={product.origin === 'africa' ? 'success' : 'info'} className="mb-4">
              {product.origin === 'africa' ? '🌍 Produit Africain' : '🌏 Produit Asiatique'}
            </Badge>

            <h1 className="text-4xl font-montserrat font-extrabold text-secondary mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} avis)</span>
            </div>

            <p className="text-5xl font-bold text-accent-green mb-6">
              {product.price.toLocaleString('fr-FR')} FCFA
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent-green" />
                <span>Origine: <strong>{product.country}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-green" />
                <span>Délai de livraison: <strong>{product.deliveryTime} jours</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-accent-green" />
                <span>Stock disponible: <strong>{product.stock} unités</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent-green" />
                <span>Fournisseur: <strong>{product.supplier.name}</strong></span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-poppins font-semibold mb-2">Quantité</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-accent-green"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-accent-green"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button variant="primary" size="lg" className="flex-1 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </Button>
              <Button variant="outline" size="lg">
                Favoris
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-accent-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-poppins font-semibold mb-1">Paiement sécurisé</p>
                  <p className="text-sm text-gray-600">
                    Acompte de 50% à la commande. Le solde sera payé à la livraison.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-12">
          <h2 className="text-2xl font-poppins font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </Card>

        {/* Reviews */}
        <Card>
          <h2 className="text-2xl font-poppins font-semibold mb-6">
            Avis clients ({productReviews.length})
          </h2>

          <div className="space-y-6">
            {productReviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-accent-green rounded-full flex items-center justify-center text-white font-semibold">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-poppins font-semibold">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 ml-14">{review.comment}</p>
                <p className="text-sm text-gray-500 ml-14 mt-2">
                  {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
