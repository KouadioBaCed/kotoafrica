'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { Input, Button, Card } from '@/components/ui'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ConnexionPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // États pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // États pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
    address: '',
    postal_code: '',
    city: ''
  })

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Connexion
        await signIn(loginData.email, loginData.password)
        router.push('/') // Redirection vers la page d'accueil
      } else {
        // Inscription
        if (registerData.password !== registerData.password2) {
          setError('Les mots de passe ne correspondent pas')
          setLoading(false)
          return
        }
        await signUp(registerData)
        router.push('/') // Redirection vers la page d'accueil
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  // Gestion des changements de champs pour la connexion
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  // Gestion des changements de champs pour l'inscription
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-montserrat font-extrabold text-secondary mb-2">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte KÔTO AFRICA'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      name="first_name"
                      type="text"
                      placeholder="Prénom"
                      value={registerData.first_name}
                      onChange={handleRegisterChange}
                      required
                    />
                    <Input
                      label="Nom"
                      name="last_name"
                      type="text"
                      placeholder="Nom"
                      value={registerData.last_name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <Input
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    placeholder="+225 XX XX XX XX XX"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={isLogin ? loginData.email : registerData.email}
                onChange={isLogin ? handleLoginChange : handleRegisterChange}
                required
              />

              <Input
                label="Mot de passe"
                name="password"
                type="password"
                placeholder="••••••••"
                value={isLogin ? loginData.password : registerData.password}
                onChange={isLogin ? handleLoginChange : handleRegisterChange}
                required
              />

              {!isLogin && (
                <>
                  <Input
                    label="Confirmer le mot de passe"
                    name="password2"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password2}
                    onChange={handleRegisterChange}
                    required
                  />
                  <Input
                    label="Adresse"
                    name="address"
                    type="text"
                    placeholder="Votre adresse"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Code postal"
                      name="postal_code"
                      type="text"
                      placeholder="01"
                      value={registerData.postal_code}
                      onChange={handleRegisterChange}
                      required
                    />
                    <Input
                      label="Ville"
                      name="city"
                      type="text"
                      placeholder="Abidjan"
                      value={registerData.city}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-accent-green" />
                    <span>Se souvenir de moi</span>
                  </label>
                  <Link href="/mot-de-passe-oublie" className="text-accent-green hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>Chargement...</>
                ) : isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    S'inscrire
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-accent-green hover:underline"
                type="button"
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-4">Vous êtes fournisseur ?</p>
              <Link href="/fournisseurs/connexion">
                <Button variant="outline" size="md" className="w-full">
                  Espace Fournisseur
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
