'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui'
import { FinancialStats } from '@/types'
import {
  DollarSign,
  TrendingUp,
  Package,
  Crown,
  Briefcase,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Données mockées pour la démonstration
const mockFinancialStats: FinancialStats[] = [
  {
    period: '2024-06',
    platformCommissions: 2500000,
    logisticsRevenue: 3200000,
    premiumSubscriptions: 1500000,
    conciergeRevenue: 4500000,
    totalRevenue: 11700000,
    totalOrders: 145,
    averageOrderValue: 80689
  },
  {
    period: '2024-07',
    platformCommissions: 2800000,
    logisticsRevenue: 3500000,
    premiumSubscriptions: 1800000,
    conciergeRevenue: 5200000,
    totalRevenue: 13300000,
    totalOrders: 168,
    averageOrderValue: 79166
  },
  {
    period: '2024-08',
    platformCommissions: 3200000,
    logisticsRevenue: 4100000,
    premiumSubscriptions: 2100000,
    conciergeRevenue: 6800000,
    totalRevenue: 16200000,
    totalOrders: 192,
    averageOrderValue: 84375
  },
  {
    period: '2024-09',
    platformCommissions: 3800000,
    logisticsRevenue: 4800000,
    premiumSubscriptions: 2500000,
    conciergeRevenue: 7500000,
    totalRevenue: 18600000,
    totalOrders: 215,
    averageOrderValue: 86511
  },
  {
    period: '2024-10',
    platformCommissions: 4200000,
    logisticsRevenue: 5200000,
    premiumSubscriptions: 2800000,
    conciergeRevenue: 8300000,
    totalRevenue: 20500000,
    totalOrders: 234,
    averageOrderValue: 87606
  },
]

export default function FinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Statistiques du mois en cours
  const currentMonth = mockFinancialStats[mockFinancialStats.length - 1]
  const previousMonth = mockFinancialStats[mockFinancialStats.length - 2]

  // Calculer les variations
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const totalRevenueGrowth = calculateGrowth(currentMonth.totalRevenue, previousMonth.totalRevenue)
  const commissionsGrowth = calculateGrowth(currentMonth.platformCommissions, previousMonth.platformCommissions)
  const logisticsGrowth = calculateGrowth(currentMonth.logisticsRevenue, previousMonth.logisticsRevenue)
  const premiumGrowth = calculateGrowth(currentMonth.premiumSubscriptions, previousMonth.premiumSubscriptions)
  const conciergeGrowth = calculateGrowth(currentMonth.conciergeRevenue, previousMonth.conciergeRevenue)

  // Préparer les données pour les graphiques
  const chartData = mockFinancialStats.map(stat => ({
    mois: new Date(stat.period + '-01').toLocaleDateString('fr-FR', { month: 'short' }),
    commissions: stat.platformCommissions / 1000000,
    logistique: stat.logisticsRevenue / 1000000,
    premium: stat.premiumSubscriptions / 1000000,
    conciergerie: stat.conciergeRevenue / 1000000,
    total: stat.totalRevenue / 1000000,
  }))

  // Répartition des revenus du mois actuel
  const revenueDistribution = [
    { name: 'Commissions Plateformes', value: currentMonth.platformCommissions, color: '#3B82F6' },
    { name: 'Gains Logistiques', value: currentMonth.logisticsRevenue, color: '#10B981' },
    { name: 'Abonnements Premium', value: currentMonth.premiumSubscriptions, color: '#F59E0B' },
    { name: 'Service Conciergerie', value: currentMonth.conciergeRevenue, color: '#8B5CF6' },
  ]

  const stats = [
    {
      title: 'Revenus Totaux',
      value: currentMonth.totalRevenue,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      growth: totalRevenueGrowth,
    },
    {
      title: 'Commissions Plateformes',
      value: currentMonth.platformCommissions,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      growth: commissionsGrowth,
    },
    {
      title: 'Gains Logistiques',
      value: currentMonth.logisticsRevenue,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      growth: logisticsGrowth,
    },
    {
      title: 'Abonnements Premium',
      value: currentMonth.premiumSubscriptions,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      growth: premiumGrowth,
    },
    {
      title: 'Service Conciergerie',
      value: currentMonth.conciergeRevenue,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      growth: conciergeGrowth,
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
            Statistiques Financières
          </h1>
          <p className="text-gray-600">Vue détaillée des revenus et commissions</p>
        </div>

        {/* Filtres de période */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => {
          const isPositive = Number(stat.growth) >= 0
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(Number(stat.growth))}%
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-xl font-bold text-secondary">
                  {stat.value.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Évolution des revenus */}
        <Card>
          <h2 className="text-xl font-poppins font-semibold mb-6">Évolution des Revenus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}M FCFA`}
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition des revenus */}
        <Card>
          <h2 className="text-xl font-poppins font-semibold mb-6">Répartition des Revenus (Mois actuel)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={revenueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString('fr-FR')} FCFA`}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Détails par source de revenus */}
      <Card className="mb-8">
        <h2 className="text-xl font-poppins font-semibold mb-6">Détails par Source de Revenus</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}M FCFA`}
            />
            <Legend />
            <Bar dataKey="commissions" fill="#3B82F6" name="Commissions" />
            <Bar dataKey="logistique" fill="#10B981" name="Logistique" />
            <Bar dataKey="premium" fill="#F59E0B" name="Premium" />
            <Bar dataKey="conciergerie" fill="#8B5CF6" name="Conciergerie" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Métriques additionnelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-poppins font-semibold mb-4 text-secondary">
            Performance Mensuelle
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Commandes</span>
              <span className="font-bold text-secondary">{currentMonth.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Valeur Moyenne</span>
              <span className="font-bold text-accent-green">
                {currentMonth.averageOrderValue.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux de croissance</span>
              <span className="font-bold text-green-600">+{totalRevenueGrowth}%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-poppins font-semibold mb-4 text-secondary">
            Top Sources de Revenus
          </h3>
          <div className="space-y-3">
            {revenueDistribution
              .sort((a, b) => b.value - a.value)
              .map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: item.color }}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      {((item.value / currentMonth.totalRevenue) * 100).toFixed(1)}% du total
                    </p>
                  </div>
                  <p className="font-bold text-secondary text-sm">
                    {(item.value / 1000000).toFixed(1)}M
                  </p>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-poppins font-semibold mb-4 text-secondary">
            Objectifs du Mois
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Revenus</span>
                <span className="font-semibold">
                  {((currentMonth.totalRevenue / 25000000) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min((currentMonth.totalRevenue / 25000000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Objectif: 25M FCFA</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Commandes</span>
                <span className="font-semibold">
                  {((currentMonth.totalOrders / 250) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min((currentMonth.totalOrders / 250) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Objectif: 250 commandes</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Premium</span>
                <span className="font-semibold">
                  {((currentMonth.premiumSubscriptions / 3000000) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${Math.min((currentMonth.premiumSubscriptions / 3000000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Objectif: 3M FCFA</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
