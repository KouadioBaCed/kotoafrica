/**
 * Utilitaires pour l'analyse d'images et la recherche de produits similaires
 */

type Product = {
  id: string;
  name: string;
  category: string;
  images: string[];
  description: string;
};

/**
 * Extrait les couleurs dominantes d'une image
 */
export async function extractDominantColors(imageDataUrl: string): Promise<number[][]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }

      // Réduire la taille pour améliorer les performances
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Échantillonnage de pixels pour obtenir les couleurs dominantes
      const colorMap: { [key: string]: number } = {};

      for (let i = 0; i < pixels.length; i += 4 * 10) { // Échantillonner tous les 10 pixels
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Ignorer les pixels trop clairs ou trop foncés
        const brightness = (r + g + b) / 3;
        if (brightness > 250 || brightness < 10) continue;

        // Arrondir les couleurs pour regrouper les similaires
        const key = `${Math.floor(r / 30)},${Math.floor(g / 30)},${Math.floor(b / 30)}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }

      // Obtenir les 3 couleurs les plus fréquentes
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => key.split(',').map(v => parseInt(v) * 30));

      resolve(sortedColors);
    };
    img.src = imageDataUrl;
  });
}

/**
 * Analyse l'image et extrait des caractéristiques
 */
export async function analyzeImage(imageDataUrl: string) {
  const colors = await extractDominantColors(imageDataUrl);

  // Déterminer la catégorie probable basée sur les couleurs
  const categoryGuess = guessCategory(colors);

  return {
    dominantColors: colors,
    suggestedCategory: categoryGuess,
  };
}

/**
 * Devine la catégorie basée sur les couleurs dominantes
 */
function guessCategory(colors: number[][]): string {
  if (colors.length === 0) return 'all';

  const [r, g, b] = colors[0];

  // Textile/Vêtements - couleurs vives et variées
  if (r > 150 && g > 150 && b < 100) return 'Textile'; // Jaune
  if (r > 150 && g < 100 && b < 100) return 'Vêtements'; // Rouge
  if (r < 100 && g < 100 && b > 150) return 'Vêtements'; // Bleu

  // Électronique - tons gris, noir, blanc
  const isGrayish = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
  if (isGrayish && r < 100) return 'Électronique'; // Gris foncé/noir

  // Art & Déco - couleurs naturelles (marron, beige)
  if (r > 100 && r < 180 && g > 80 && g < 150 && b < 100) return 'Art & Déco';

  // Maison - tons neutres
  if (isGrayish && r > 150) return 'Maison'; // Gris clair

  // Accessoires - couleurs métalliques
  if (r > 150 && g > 150 && b > 100) return 'Accessoires';

  return 'all';
}

/**
 * Recherche des produits similaires basée sur l'analyse d'image
 */
export async function searchProductsByImage(
  imageDataUrl: string,
  products: Product[]
): Promise<Product[]> {
  const analysis = await analyzeImage(imageDataUrl);

  let matchedProducts: Product[] = [];

  // Si une catégorie est devinée, filtrer par catégorie
  if (analysis.suggestedCategory !== 'all') {
    matchedProducts = products.filter(
      p => p.category === analysis.suggestedCategory
    );
  }

  // Si pas de résultats par catégorie, chercher dans les noms/descriptions
  if (matchedProducts.length === 0) {
    // Rechercher des mots-clés basés sur les couleurs
    const colorKeywords = getColorKeywords(analysis.dominantColors);

    matchedProducts = products.filter(p => {
      const text = `${p.name} ${p.description}`.toLowerCase();
      return colorKeywords.some(keyword => text.includes(keyword));
    });
  }

  // Limiter à 8 résultats maximum
  return matchedProducts.slice(0, 8);
}

/**
 * Obtient des mots-clés de couleur basés sur les couleurs dominantes
 */
function getColorKeywords(colors: number[][]): string[] {
  const keywords: string[] = [];

  colors.forEach(([r, g, b]) => {
    if (r > 200 && g < 100 && b < 100) keywords.push('rouge', 'red');
    if (r < 100 && g > 200 && b < 100) keywords.push('vert', 'green');
    if (r < 100 && g < 100 && b > 200) keywords.push('bleu', 'blue');
    if (r > 200 && g > 200 && b < 100) keywords.push('jaune', 'yellow');
    if (r > 200 && g < 100 && b > 200) keywords.push('rose', 'pink');
    if (r > 100 && g > 100 && b < 80) keywords.push('marron', 'brown');
    if (r < 50 && g < 50 && b < 50) keywords.push('noir', 'black');
    if (r > 200 && g > 200 && b > 200) keywords.push('blanc', 'white');
  });

  return keywords;
}
