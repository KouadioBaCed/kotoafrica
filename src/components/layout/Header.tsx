'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '../ui'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <h1 className="text-3xl font-montserrat font-extrabold text-primary">
              KÔTO AFRICA
            </h1>
            <p className="text-xs text-secondary-light font-openSans">
              L'Afrique connectée au monde
            </p>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 focus:border-accent-green focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/panier" className="relative hover:text-accent-green transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-accent-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link href="/connexion">
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <User className="w-4 h-4" />
                Connexion
              </Button>
            </Link>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 pb-4 border-t pt-4">
          <Link href="/" className="font-poppins font-semibold hover:text-accent-green transition-colors">
            Accueil
          </Link>
          <Link href="/catalogue" className="font-poppins font-semibold hover:text-accent-green transition-colors">
            Catalogue
          </Link>
          <Link href="/categories" className="font-poppins font-semibold hover:text-accent-green transition-colors">
            Catégories
          </Link>
          <Link href="/fournisseurs" className="font-poppins font-semibold hover:text-accent-green transition-colors">
            Fournisseurs
          </Link>
          <Link href="/contact" className="font-poppins font-semibold hover:text-accent-green transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-gray-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Link href="/" className="py-2 font-poppins font-semibold">Accueil</Link>
              <Link href="/catalogue" className="py-2 font-poppins font-semibold">Catalogue</Link>
              <Link href="/categories" className="py-2 font-poppins font-semibold">Catégories</Link>
              <Link href="/fournisseurs" className="py-2 font-poppins font-semibold">Fournisseurs</Link>
              <Link href="/contact" className="py-2 font-poppins font-semibold">Contact</Link>
              <Link href="/connexion">
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
