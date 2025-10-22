'use client'

import { useState } from 'react'
import { AllReviewsManagement } from '@/components/admin/AllReviewsManagement'
import { ReviewsModeration } from '@/components/admin/ReviewsModeration'

export default function AdminAvisPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'moderation'>('all')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md mb-6">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-montserrat font-extrabold text-[#4A2C2A] mb-4">
            Gestion des Avis
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1BAA70] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tous les avis
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'moderation'
                  ? 'bg-[#1BAA70] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Modération
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {activeTab === 'all' ? <AllReviewsManagement /> : <ReviewsModeration />}
      </div>
    </div>
  )
}
