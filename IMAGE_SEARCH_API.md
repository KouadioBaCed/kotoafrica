# 📸 Recherche par Image - Guide d'Intégration API

## État Actuel
La recherche par image est actuellement implémentée avec une **simulation basique**. L'image est affichée et quelques produits sont retournés comme résultats d'exemple.

## Intégration d'une API de Vision Réelle

Pour implémenter une vraie recherche par image, vous pouvez utiliser l'une de ces solutions :

### 1. **Google Cloud Vision API** (Recommandé)
```typescript
// Exemple d'intégration
import vision from '@google-cloud/vision';

async function searchByImage(imageBase64: string) {
  const client = new vision.ImageAnnotatorClient();

  // Détection d'objets/produits
  const [result] = await client.productSearch({
    image: { content: imageBase64 },
    productSet: 'projects/YOUR_PROJECT/locations/YOUR_LOCATION/productSets/YOUR_SET',
  });

  return result.results;
}
```

### 2. **Amazon Rekognition**
```typescript
import AWS from 'aws-sdk';

const rekognition = new AWS.Rekognition();

async function searchByImage(imageBytes: Buffer) {
  const params = {
    CollectionId: 'koto-africa-products',
    Image: { Bytes: imageBytes },
    MaxFaces: 10,
  };

  const result = await rekognition.searchFacesByImage(params).promise();
  return result.FaceMatches;
}
```

### 3. **Alibaba Cloud Image Search** (Idéal pour e-commerce)
```typescript
// API similaire à celle utilisée par Alibaba
// https://www.alibabacloud.com/help/en/imagesearch

async function searchByImage(imageUrl: string) {
  const response = await fetch('https://imagesearch.cn-shanghai.aliyuncs.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'YOUR_API_KEY',
    },
    body: JSON.stringify({
      image: imageUrl,
      category_id: 0, // 0 = tous les produits
      num: 20, // nombre de résultats
    }),
  });

  return response.json();
}
```

### 4. **TensorFlow.js (Solution locale)**
```typescript
import * as mobilenet from '@tensorflow-models/mobilenet';

async function searchByImageLocal(imageElement: HTMLImageElement) {
  // Charger le modèle
  const model = await mobilenet.load();

  // Classifier l'image
  const predictions = await model.classify(imageElement);

  // Rechercher des produits correspondants
  const matchingProducts = products.filter(p =>
    predictions.some(pred =>
      p.category.toLowerCase().includes(pred.className.toLowerCase())
    )
  );

  return matchingProducts;
}
```

## Modification du Code

Pour intégrer une API réelle, modifiez la fonction `filterProducts()` dans `HomePage.tsx`:

```typescript
// Remplacer cette section :
if (imageSearchActive && uploadedImage) {
  // Simulation actuelle
  filtered = filtered.slice(0, 6);
}

// Par :
if (imageSearchActive && uploadedImage) {
  try {
    // Appel à l'API de vision
    const searchResults = await searchByImageAPI(uploadedImage);

    // Filtrer les produits selon les résultats
    const productIds = searchResults.map(r => r.productId);
    filtered = filtered.filter(p => productIds.includes(p.id));
  } catch (error) {
    console.error('Erreur recherche image:', error);
    // Fallback sur la simulation
    filtered = filtered.slice(0, 6);
  }
}
```

## Coûts Estimés

| Service | Prix Approximatif |
|---------|------------------|
| Google Cloud Vision | ~$1.50 / 1000 images |
| Amazon Rekognition | ~$1.00 / 1000 images |
| Alibaba Image Search | ~$0.50 / 1000 images |
| TensorFlow.js | Gratuit (local) |

## Recommandation

Pour **KÔTO AFRICA**, nous recommandons :
1. **Court terme** : TensorFlow.js pour une solution gratuite et locale
2. **Long terme** : Alibaba Cloud Image Search (meilleure intégration avec les produits Alibaba)

## Prochaines Étapes

1. ✅ Interface de recherche par image (FAIT)
2. ⏳ Choisir et configurer l'API de vision
3. ⏳ Créer un index de produits avec embeddings
4. ⏳ Implémenter la recherche de similarité
5. ⏳ Optimiser les performances et la précision
