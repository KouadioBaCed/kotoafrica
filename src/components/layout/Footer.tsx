import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-montserrat font-extrabold text-primary mb-4">
              KÔTO AFRICA
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              L'Afrique connectée au monde
            </p>
            <p className="text-sm text-gray-300">
              Votre plateforme d'intermédiation e-commerce reliant l'Afrique aux marchés mondiaux.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogue" className="text-gray-300 hover:text-primary transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/fournisseurs" className="text-gray-300 hover:text-primary transition-colors">
                  Devenir Fournisseur
                </Link>
              </li>
              <li>
                <Link href="/aide" className="text-gray-300 hover:text-primary transition-colors">
                  Centre d'Aide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Informations Légales</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="text-gray-300 hover:text-primary transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-300 hover:text-primary transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-300 hover:text-primary transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-primary transition-colors">
                  Gestion des Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-300">contact@kotoafrica.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-300">+225 XX XX XX XX XX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-300">Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} KÔTO AFRICA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
