'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout'
import { Button, Card, Input } from '@/components/ui'
import { Check, Package, CreditCard, CheckCircle } from 'lucide-react'

export default function CommandePage() {
  const [step, setStep] = useState(1)
  const total = 97000
  const deposit = 48500

  const steps = [
    { number: 1, title: 'Récapitulatif', icon: Package },
    { number: 2, title: 'Paiement', icon: CreditCard },
    { number: 3, title: 'Confirmation', icon: CheckCircle },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-montserrat font-extrabold text-secondary mb-8">
          Ma Commande
        </h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                    step >= s.number
                      ? 'bg-accent-green text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.number ? (
                    <Check className="w-8 h-8" />
                  ) : (
                    <s.icon className="w-8 h-8" />
                  )}
                </div>
                <p className="text-sm font-poppins font-semibold">{s.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-32 h-1 mx-4 ${
                    step > s.number ? 'bg-accent-green' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          {step === 1 && (
            <Card>
              <h2 className="text-2xl font-poppins font-semibold mb-6">Récapitulatif de la commande</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start pb-4 border-b">
                  <div>
                    <h3 className="font-poppins font-semibold">Masque Baoulé Traditionnel</h3>
                    <p className="text-sm text-gray-600">Quantité: 1</p>
                  </div>
                  <p className="font-bold">45,000 FCFA</p>
                </div>
                <div className="flex justify-between items-start pb-4 border-b">
                  <div>
                    <h3 className="font-poppins font-semibold">Tissu Wax Premium</h3>
                    <p className="text-sm text-gray-600">Quantité: 2</p>
                  </div>
                  <p className="font-bold">24,000 FCFA</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-poppins font-semibold mb-3">Adresse de livraison</h3>
                <Input placeholder="Adresse complète" className="mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Code postal" />
                  <Input placeholder="Ville" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-accent-green">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Continuer vers le paiement
              </Button>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <h2 className="text-2xl font-poppins font-semibold mb-6">Paiement</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="font-poppins font-semibold mb-2">Acompte à payer (50%)</p>
                <p className="text-3xl font-bold text-accent-green mb-2">
                  {deposit.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-sm text-gray-600">
                  Le solde de {deposit.toLocaleString('fr-FR')} FCFA sera payé à la livraison
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-poppins font-semibold">Mode de paiement</h3>
                <label className="flex items-center gap-3 p-4 border-2 border-accent-green rounded-lg bg-green-50 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-accent-green" />
                  <div>
                    <p className="font-semibold">Mobile Money</p>
                    <p className="text-sm text-gray-600">Orange Money, MTN Money, Moov Money</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-accent-green">
                  <input type="radio" name="payment" className="accent-accent-green" />
                  <div>
                    <p className="font-semibold">Carte Bancaire</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard</p>
                  </div>
                </label>
              </div>

              <Input label="Numéro de téléphone" placeholder="+225 XX XX XX XX XX" className="mb-6" />

              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(3)}
                >
                  Confirmer le paiement
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card className="text-center">
              <div className="w-24 h-24 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>

              <h2 className="text-3xl font-montserrat font-extrabold text-secondary mb-4">
                Commande confirmée !
              </h2>

              <p className="text-gray-600 mb-2">Numéro de commande</p>
              <p className="text-2xl font-bold text-accent-green mb-6">KA-2025-003</p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-4">
                  Votre paiement de {deposit.toLocaleString('fr-FR')} FCFA a été reçu.
                </p>
                <p className="text-sm text-gray-600">
                  Vous recevrez un email de confirmation avec le détail de votre commande
                  et le numéro de suivi.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" size="lg">
                  Voir mes commandes
                </Button>
                <Button variant="primary" size="lg">
                  Continuer mes achats
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
