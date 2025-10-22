import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Hash, Calendar } from 'lucide-react';

export function ProfilePage() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#4A2C2A] mb-8">Mon Profil</h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#FFD835] px-6 py-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-[#4A2C2A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A2C2A]">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-[#4A2C2A] font-semibold mt-2">{profile.user_code}</p>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-bold text-[#4A2C2A] mb-6">Informations personnelles</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-[#1BAA70] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Code client</p>
                  <p className="font-semibold text-gray-800">{profile.user_code}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-[#1BAA70] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-semibold text-gray-800">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-[#1BAA70] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-semibold text-gray-800">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-[#1BAA70] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-semibold text-gray-800">{profile.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Code postal: {profile.postal_code}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[#1BAA70] mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Membre depuis</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {profile.role !== 'client' && (
                <div className="flex items-start space-x-4 p-4 bg-[#FFD835] rounded-lg">
                  <User className="w-5 h-5 text-[#4A2C2A] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-[#4A2C2A] font-semibold">Rôle</p>
                    <p className="font-bold text-[#4A2C2A]">
                      {profile.role === 'admin'
                        ? 'Administrateur'
                        : profile.role === 'supplier_africa'
                        ? 'Fournisseur Africain'
                        : 'Fournisseur Asiatique'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
