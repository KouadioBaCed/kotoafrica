'use client'

import React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { ProductCard } from '@/components/products/ProductCard'
import { Button, Card } from '@/components/ui'
import { mockProducts } from '@/data/mockData'
import { ArrowRight, Package, Shield, Truck, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const popularProducts = mockProducts.slice(0, 4)

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-yellow-300 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-montserrat font-extrabold text-secondary mb-6">
              KÔTO AFRICA
            </h1>
            <p className="text-2xl md:text-3xl font-poppins font-semibold text-secondary-light mb-4">
              L'Afrique connectée au monde
            </p>
            <p className="text-lg text-secondary mb-8">
              Découvrez des produits authentiques d'Afrique et d'Asie, livrés directement chez vous
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/catalogue">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Découvrir le catalogue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/inscription">
                <Button variant="secondary" size="lg">
                  Devenir fournisseur
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-12 h-12 text-accent-green" />,
                title: 'Connexion Globale',
                description: 'Produits d\'Afrique et d\'Asie réunis'
              },
              {
                icon: <Shield className="w-12 h-12 text-accent-green" />,
                title: 'Paiement Sécurisé',
                description: 'Acompte 50% à la commande'
              },
              {
                icon: <Truck className="w-12 h-12 text-accent-green" />,
                title: 'Livraison Rapide',
                description: 'Suivi en temps réel'
              },
              {
                icon: <Package className="w-12 h-12 text-accent-green" />,
                title: 'Qualité Garantie',
                description: 'Produits vérifiés'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-montserrat font-extrabold text-secondary mb-4">
              Produits Populaires
            </h2>
            <p className="text-gray-600">Découvrez notre sélection de produits les plus appréciés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {popularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/catalogue">
              <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
                Voir tout le catalogue
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-montserrat font-extrabold mb-4">
            Vous êtes fournisseur ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et connectez vos produits à des milliers de clients en Afrique
          </p>
          <Link href="/fournisseurs/inscription">
            <Button variant="secondary" size="lg">
              Inscrivez-vous maintenant
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
