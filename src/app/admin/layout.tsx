'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Building2,
  Settings,
  LogOut,
  BarChart3,
  Crown,
  DollarSign,
  AlertCircle,
  Briefcase,
  FileText,
  Star,
  MapPin
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      href: '/admin/reporting',
      label: 'Reporting',
      icon: BarChart3
    },
    {
      href: '/admin/finances',
      label: 'Finances',
      icon: DollarSign
    },
    {
      href: '/admin/utilisateurs',
      label: 'Utilisateurs',
      icon: Users
    },
    {
      href: '/admin/fournisseurs',
      label: 'Fournisseurs',
      icon: Building2
    },
    {
      href: '/admin/produits',
      label: 'Produits',
      icon: Package
    },
    {
      href: '/admin/produits-locaux',
      label: 'Produits Locaux',
      icon: MapPin
    },
    {
      href: '/admin/commandes',
      label: 'Commandes',
      icon: ShoppingCart
    },
    {
      href: '/admin/devis',
      label: 'Demandes de Devis',
      icon: FileText
    },
    {
      href: '/admin/avis',
      label: 'Avis Clients',
      icon: Star
    },
    {
      href: '/admin/conciergerie',
      label: 'Conciergerie',
      icon: Briefcase
    },
    {
      href: '/admin/incidents',
      label: 'Incidents',
      icon: AlertCircle
    },
    {
      href: '/admin/settings',
      label: 'Paramètres Premium',
      icon: Crown
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-montserrat font-bold">KÔTO AFRICA</h1>
          <p className="text-sm text-white/70">Administration</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent-green text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-poppins">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors w-full">
            <Settings className="w-5 h-5" />
            <span className="font-poppins">Paramètres</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full mt-2">
            <LogOut className="w-5 h-5" />
            <span className="font-poppins">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
