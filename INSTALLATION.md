# Guide d'Installation - KÔTO AFRICA

Ce guide vous aidera à installer et configurer le projet complet KÔTO AFRICA.

## Prérequis

- **Node.js** 18+ et npm
- **Python** 3.10+
- **Git**

## Installation Frontend (Next.js)

1. **Installer les dépendances Node.js**

```bash
npm install
```

2. **Lancer le serveur de développement**

```bash
npm run dev
```

Le frontend sera accessible sur **http://localhost:3000**

### Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build pour production
npm start        # Démarrer en production
npm run lint     # Linter le code
```

## Installation Backend (Django)

1. **Naviguer vers le dossier backend**

```bash
cd backend
```

2. **Créer un environnement virtuel Python**

**Windows :**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac :**
```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Installer les dépendances Python**

```bash
pip install -r requirements.txt
```

4. **Effectuer les migrations de base de données**

```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Créer et importer les produits depuis Excel** ⭐ NOUVEAU

```bash
# Créer les fichiers Excel exemples avec 25 produits
python create_excel_samples.py

# Importer les produits dans la base de données
python manage.py import_products_excel
```

Cela créera 5 fichiers Excel par catégorie et importera 25 produits automatiquement !

6. **Créer un superutilisateur (admin)**

```bash
python manage.py createsuperuser
```

Suivez les instructions pour créer votre compte administrateur.

7. **Lancer le serveur Django**

```bash
python manage.py runserver
```

Le backend sera accessible sur **http://localhost:8001**

### URLs importantes du backend

- **API** : http://localhost:8001/api/
- **Admin Django** : http://localhost:8001/admin/
- **Documentation API** : Voir README.md du backend

## Configuration

### Frontend

Le frontend est configuré pour se connecter au backend Django sur `http://localhost:8001`.

Si vous changez le port du backend, mettez à jour les appels API dans le frontend.

### Backend

La configuration Django se trouve dans `backend/koto_africa/settings.py`

**Paramètres importants :**

- `DEBUG = True` (développement uniquement)
- `ALLOWED_HOSTS = ['*']` (à restreindre en production)
- `DATABASES` : SQLite par défaut (à changer pour PostgreSQL en production)
- `CORS_ALLOWED_ORIGINS` : Configuré pour Next.js sur port 3000

## Données de Démonstration

Le projet inclut des données mockées dans le frontend pour démonstration immédiate.

Pour créer des données dans le backend Django :

1. Accédez à l'admin Django : http://localhost:8001/admin/
2. Connectez-vous avec votre superutilisateur
3. Créez des catégories, fournisseurs, produits, etc.

## Structure des URLs

### Frontend

- **Accueil** : http://localhost:3000/
- **Catalogue** : http://localhost:3000/catalogue
- **Produit** : http://localhost:3000/produits/[id]
- **Panier** : http://localhost:3000/panier
- **Commande** : http://localhost:3000/commande
- **Connexion** : http://localhost:3000/connexion
- **Profil** : http://localhost:3000/profil
- **Admin Dashboard** : http://localhost:3000/admin/dashboard
- **Fournisseurs** : http://localhost:3000/fournisseurs/dashboard
- **Fournisseurs Asie** : http://localhost:3000/fournisseurs-asie/dashboard

### Backend API

Voir la documentation complète dans `backend/README.md`

## Dépannage

### Erreur : Module non trouvé (Frontend)

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : No module named 'django' (Backend)

```bash
# Activer l'environnement virtuel
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Réinstaller les dépendances
pip install -r requirements.txt
```

### Port déjà utilisé

**Frontend (port 3000) :**
```bash
# Tuer le process sur le port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

**Backend (port 8000) :**
```bash
# Utiliser un autre port
python manage.py runserver 8001
```

### Problème CORS

Si vous rencontrez des erreurs CORS :

1. Vérifiez que `django-cors-headers` est installé
2. Vérifiez la configuration dans `backend/koto_africa/settings.py`
3. Assurez-vous que le frontend tourne sur `http://localhost:3000`

## Production

### Frontend

```bash
# Build
npm run build

# Start
npm start
```

### Backend

1. Changez `DEBUG = False` dans settings.py
2. Configurez `ALLOWED_HOSTS`
3. Utilisez PostgreSQL au lieu de SQLite
4. Configurez les fichiers statiques et media
5. Utilisez un serveur WSGI (Gunicorn, uWSGI)
6. Configurez un reverse proxy (Nginx)

## Support

Pour toute question ou problème :

1. Consultez la documentation dans `README.md`
2. Vérifiez les logs du serveur
3. Consultez la documentation Django/Next.js

---

**Bon développement avec KÔTO AFRICA !** 🚀
