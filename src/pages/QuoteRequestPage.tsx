import { useState } from 'react';
import { Upload, Send, CheckCircle, FileImage } from 'lucide-react';

type QuoteFormData = {
  fullName: string;
  whatsapp: string;
  description: string;
  color: string;
  quantity: number;
  shoeSize: string;
  clothingSize: string;
  gender: 'homme' | 'femme' | 'enfant' | '';
  photoFile: File | null;
  photoPreview: string;
};

export function QuoteRequestPage() {
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    whatsapp: '',
    description: '',
    color: '',
    quantity: 1,
    shoeSize: '',
    clothingSize: '',
    gender: '',
    photoFile: null,
    photoPreview: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        photoFile: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Envoyer à Supabase
    console.log('Demande de devis:', formData);

    setSubmitting(false);
    setSubmitted(true);

    // Reset après 5 secondes
    setTimeout(() => {
      setFormData({
        fullName: '',
        whatsapp: '',
        description: '',
        color: '',
        quantity: 1,
        shoeSize: '',
        clothingSize: '',
        gender: '',
        photoFile: null,
        photoPreview: '',
      });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-2">Demande de Devis</h1>
          <p className="text-gray-600">
            Remplissez ce formulaire pour obtenir un devis personnalisé pour votre produit
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">
                Demande envoyée avec succès!
              </h2>
              <p className="text-gray-600 mb-4">
                Nous avons bien reçu votre demande de devis. Notre équipe vous contactera sur WhatsApp dans les plus brefs délais.
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  📱 Vous serez contacté au: <span className="font-bold text-[#1BAA70]">{formData.whatsapp}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-6">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom complet du client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
                  placeholder="Ex: Kouadio Jean-Pierre"
                />
              </div>

              {/* Numéro WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
                  placeholder="Ex: +225 07 XX XX XX XX"
                />
              </div>

              {/* Je veux */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Je veux (Description du produit) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent resize-none"
                  placeholder="Décrivez le produit que vous souhaitez (ex: chemise en coton, chaussures de sport, etc.)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Couleur */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Couleur
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
                    placeholder="Ex: Bleu, Rouge, Noir..."
                  />
                </div>

                {/* Quantité */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantité <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pointure */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pointure (si chaussures)
                  </label>
                  <input
                    type="text"
                    value={formData.shoeSize}
                    onChange={(e) => setFormData({ ...formData, shoeSize: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
                    placeholder="Ex: 42, 38, 45..."
                  />
                </div>

                {/* Taille */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Taille (si vêtement)
                  </label>
                  <input
                    type="text"
                    value={formData.clothingSize}
                    onChange={(e) => setFormData({ ...formData, clothingSize: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BAA70] focus:border-transparent"
                    placeholder="Ex: S, M, L, XL, XXL..."
                  />
                </div>
              </div>

              {/* Pour (Genre) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pour <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'homme' })}
                    className={`py-3 rounded-lg border-2 font-semibold transition ${
                      formData.gender === 'homme'
                        ? 'border-[#1BAA70] bg-green-50 text-[#1BAA70]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    👨 Homme
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'femme' })}
                    className={`py-3 rounded-lg border-2 font-semibold transition ${
                      formData.gender === 'femme'
                        ? 'border-[#1BAA70] bg-green-50 text-[#1BAA70]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    👩 Femme
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'enfant' })}
                    className={`py-3 rounded-lg border-2 font-semibold transition ${
                      formData.gender === 'enfant'
                        ? 'border-[#1BAA70] bg-green-50 text-[#1BAA70]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    👶 Enfant
                  </button>
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photo du produit souhaité
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1BAA70] transition">
                  {formData.photoPreview ? (
                    <div className="relative">
                      <img
                        src={formData.photoPreview}
                        alt="Aperçu"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoFile: null, photoPreview: '' })}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Cliquez pour télécharger une photo
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG jusqu'à 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Info importante */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileImage className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Note importante</p>
                    <p>
                      Notre équipe vous contactera sur WhatsApp pour confirmer les détails et vous envoyer le devis.
                      Le délai de réponse est généralement de 24h à 48h.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={submitting || !formData.gender}
                className="w-full bg-[#1BAA70] text-white py-4 rounded-lg hover:bg-[#158f5d] transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
