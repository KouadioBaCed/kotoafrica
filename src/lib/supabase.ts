import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_code: string;
          first_name: string;
          last_name: string;
          phone: string;
          address: string;
          postal_code: string;
          role: 'client' | 'admin' | 'supplier_africa' | 'supplier_asia';
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          origin: 'africa' | 'asia';
          stock_quantity: number;
          weight_kg: number;
          volume_m3: number;
          delivery_days: number;
          images: string[];
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
          subtotal: number;
          shipping_cost: number;
          total: number;
          payment_first_amount: number;
          payment_first_paid: boolean;
          payment_first_date: string | null;
          payment_second_amount: number;
          payment_second_paid: boolean;
          payment_second_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          order_id: string;
          rating: number;
          comment: string;
          is_verified: boolean;
          is_approved: boolean;
          created_at: string;
        };
      };
    };
  };
};
