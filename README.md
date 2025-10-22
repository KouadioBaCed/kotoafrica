# KÔTO AFRICA - Plateforme d'Intermédiation E-commerce

**"L'Afrique connectée au monde"**

Plateforme complète d'intermédiation e-commerce connectant les produits africains et asiatiques aux consommateurs.

## 🎨 Charte Graphique

- **Jaune doré** `#FFD835` - Couleur dominante
- **Marron foncé** `#4A2C2A` - Textes/titres
- **Vert émeraude** `#1BAA70` - Accents/CTA
- **Bleu profond** `#1C3D73` - Sections secondaires
- **Blanc pur** `#FFFFFF` - Fonds

### Polices
- **Titres** : Montserrat Extra Bold
- **Sous-titres** : Poppins Semi-Bold
- **Corps** : Open Sans Regular

## 📁 Structure du Projet

```
koto_africa/
├── src/                          # Frontend Next.js
│   ├── app/                      # Pages Next.js 14 (App Router)
│   │   ├── page.tsx             # Page d'accueil
│   │   ├── catalogue/           # Catalogue produits
│   │   ├── produits/[id]/       # Fiche produit
│   │   ├── panier/              # Panier
│   │   ├── commande/            # Process de commande
│   │   ├── connexion/           # Connexion/Inscription
│   │   ├── profil/              # Profil utilisateur
│   │   ├── admin/               # Dashboard admin
│   │   │   ├── dashboard/
│   │   │   ├── produits/
│   │   │   └── commandes/
│   │   ├── fournisseurs/        # Dashboard fournisseurs africains
│   │   │   ├── dashboard/
│   │   │   └── produits/
│   │   └── fournisseurs-asie/   # Dashboard fournisseurs asiatiques
│   │       └── dashboard/
│   ├── components/              # Composants React
│   │   ├── ui/                  # Composants UI réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/              # Layout global
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   └── products/            # Composants produits
│   │       └── ProductCard.tsx
│   ├── data/                    # Données mockées
│   │   └── mockData.ts
│   └── types/                   # Types TypeScript
│       └── index.ts
│
└── backend/                      # Backend Django REST Framework
    ├── koto_africa/             # Configuration Django
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── api/                     # Application API
    │   ├── models.py           # Modèles de données
    │   ├── serializers.py      # Serializers DRF
    │   ├── views.py            # ViewSets DRF
    │   ├── urls.py             # Routes API
    │   └── admin.py            # Configuration admin Django
    ├── manage.py
    └── requirements.txt
```

## 🚀 Installation et Démarrage

### Frontend (Next.js)

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
npm start
```

Le frontend sera accessible sur : **http://localhost:3000**

### Backend (Django)

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

Le backend sera accessible sur : **http://localhost:8001**
Admin Django : **http://localhost:8001/admin**
API : **http://localhost:8001/api/**

## 📱 Fonctionnalités

### Côté Client
- ✅ Navigation du catalogue avec filtres avancés
- ✅ Fiches produits détaillées avec avis
- ✅ Gestion du panier
- ✅ Processus de commande en 3 étapes
- ✅ Paiement sécurisé (acompte 50%)
- ✅ Suivi des commandes
- ✅ Profil utilisateur avec historique
- ✅ Système d'avis produits

### Côté Administration
- ✅ Dashboard avec statistiques globales
- ✅ Gestion des clients
- ✅ Gestion des fournisseurs (validation, filtres)
- ✅ Gestion des produits (activation/désactivation)
- ✅ Suivi des commandes et statuts
- ✅ Gestion des paiements
- ✅ Validation des avis

### Fournisseurs Africains
- ✅ Dashboard personnel
- ✅ Gestion du catalogue
- ✅ Suivi des commandes
- ✅ Historique des paiements

### Fournisseurs Asiatiques
- ✅ Intégration API automatique
- ✅ Synchronisation catalogue
- ✅ Import des commandes
- ✅ Suivi logistique

## 🔌 Endpoints API

### Produits
```
GET    /api/products/              # Liste des produits
GET    /api/products/popular/      # Produits populaires
GET    /api/products/featured/     # Produits vedettes
GET    /api/products/{id}/         # Détails produit
POST   /api/products/              # Créer produit
PUT    /api/products/{id}/         # Modifier produit
```

### Commandes
```
GET    /api/orders/                # Liste des commandes
POST   /api/orders/                # Créer commande
GET    /api/orders/{id}/           # Détails commande
POST   /api/orders/{id}/update_status/  # Mettre à jour statut
```

### Paiements
```
GET    /api/payments/              # Liste des paiements
POST   /api/payments/              # Créer paiement
GET    /api/payments/{id}/         # Détails paiement
```

### Autres
```
GET    /api/users/                 # Utilisateurs
GET    /api/suppliers/             # Fournisseurs
GET    /api/categories/            # Catégories
GET    /api/reviews/               # Avis
```

## 🎯 Modèles de Données

### User
- Support multi-types : Client, Fournisseur Africain, Fournisseur Asiatique, Admin
- ID auto-généré pour clients : `KA-[code postal]-[numéro]`

### Product
- Origine : Afrique ou Asie
- Stock, prix, délai de livraison
- Rating et avis
- Images multiples

### Order
- Statuts : En attente, Confirmée, Expédiée, Livrée
- Paiement : En attente, Partiel (50%), Complet
- Numéro de suivi auto-généré : `KA-YYYY-XXX`

### Payment
- Types : Acompte (50%) ou Solde
- Méthodes : Mobile Money, Carte Bancaire, Espèces

## 🎨 Composants UI

Tous les composants sont réutilisables et stylisés selon la charte graphique :

- **Button** : Variants primary, secondary, outline
- **Input** : Avec label et gestion d'erreurs
- **Card** : Avec effet hover optionnel
- **Badge** : 4 variants (success, warning, error, info)
- **Modal** : Avec animations Framer Motion
- **Toast** : Notifications temporaires

## 📦 Technologies

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **Framer Motion** - Animations
- **Lucide React** - Icônes

### Backend
- **Django 5.0** - Framework Python
- **Django REST Framework** - API REST
- **SQLite** - Base de données (dev)
- **Pillow** - Gestion d'images

## 🔐 Sécurité

- CORS configuré pour Next.js
- Validation des données côté serveur
- Protection CSRF
- Paiements sécurisés (acompte 50%)

## 📝 Données de Démonstration

Le projet inclut des données mockées pour démonstration :
- 6 produits (3 africains, 3 asiatiques)
- 4 fournisseurs
- 2 utilisateurs
- 2 commandes
- 3 avis
- Paiements associés

## 🌍 Multilangue

Interface en français avec support pour :
- Format de dates françaises
- Devise : FCFA
- Timezone : Africa/Abidjan

## 📄 Licence

Ce projet est développé pour KÔTO AFRICA.

---

**KÔTO AFRICA** - L'Afrique connectée au monde 🌍
