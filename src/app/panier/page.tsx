'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { mockProducts } from '@/data/mockData'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function PanierPage() {
  const [cartItems, setCartItems] = useState([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[1], quantity: 2 },
    { product: mockProducts[3], quantity: 1 },
  ])

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, item.quantity + delta)) }
          : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setCartItems(items => items.filter(item => item.product.id !== productId))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingFee = 5000
  const total = subtotal + shippingFee
  const deposit = total * 0.5

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-poppins font-semibold mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link href="/catalogue">
              <Button variant="primary" size="lg">
                Découvrir le catalogue
              </Button>
            </Link>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-montserrat font-extrabold text-secondary mb-8">
          Mon Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.product.id}>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-lg mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.product.country} • {item.product.category}
                    </p>
                    <p className="text-accent-green font-bold text-lg">
                      {item.product.price.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-accent-green flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-accent-green flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-2xl font-poppins font-semibold mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="font-semibold">{shippingFee.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-poppins font-semibold">Total</span>
                  <span className="font-bold text-accent-green">{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-poppins font-semibold mb-2">Acompte à payer (50%)</p>
                <p className="text-2xl font-bold text-accent-blue">{deposit.toLocaleString('fr-FR')} FCFA</p>
                <p className="text-xs text-gray-600 mt-2">
                  Le solde sera payé à la livraison
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-poppins font-semibold">Options d'expédition</h3>
                <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-accent-green rounded-lg bg-green-50">
                  <input type="radio" name="shipping" defaultChecked className="accent-accent-green" />
                  <div className="flex-1">
                    <p className="font-semibold">Standard</p>
                    <p className="text-sm text-gray-600">5-7 jours</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-accent-green">
                  <input type="radio" name="shipping" className="accent-accent-green" />
                  <div className="flex-1">
                    <p className="font-semibold">Express (+3000 FCFA)</p>
                    <p className="text-sm text-gray-600">2-3 jours</p>
                  </div>
                </label>
              </div>

              <Link href="/commande">
                <Button variant="primary" size="lg" className="w-full mt-6 flex items-center justify-center gap-2">
                  Passer la commande
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/catalogue">
                <Button variant="outline" size="md" className="w-full mt-3">
                  Continuer mes achats
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
