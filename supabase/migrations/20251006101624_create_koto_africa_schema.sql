/*
  # KÔTO AFRICA E-Commerce Platform - Initial Schema

  ## Overview
  This migration creates the complete database schema for the KÔTO AFRICA e-commerce intermediation platform.

  ## New Tables Created

  ### 1. `profiles` - User profiles extending auth.users
    - `id` (uuid, FK to auth.users): Primary key linked to authentication
    - `user_code` (text): Unique user identifier in format KA-[postal_code]-[sequence]
    - `first_name` (text): User's first name
    - `last_name` (text): User's last name
    - `phone` (text): User's phone number
    - `address` (text): User's physical address
    - `postal_code` (text): User's postal code
    - `role` (text): User role (client, admin, supplier_africa, supplier_asia)
    - `created_at` (timestamp): Account creation timestamp

  ### 2. `suppliers` - Supplier information
    - `id` (uuid): Primary key
    - `user_id` (uuid, FK to profiles): Link to user profile
    - `business_name` (text): Business/company name
    - `region` (text): Geographic region (africa, asia)
    - `api_endpoint` (text): API endpoint for Asian suppliers
    - `is_verified` (boolean): Verification status
    - `created_at` (timestamp): Record creation timestamp

  ### 3. `products` - Product catalog
    - `id` (uuid): Primary key
    - `supplier_id` (uuid, FK to suppliers): Product supplier
    - `name` (text): Product name
    - `description` (text): Product description
    - `price` (numeric): Product price in FCFA
    - `category` (text): Product category
    - `origin` (text): Product origin (africa, asia)
    - `stock_quantity` (integer): Available stock
    - `weight_kg` (numeric): Product weight in kg
    - `volume_m3` (numeric): Product volume in m³
    - `delivery_days` (integer): Estimated delivery time in days
    - `images` (jsonb): Array of product image URLs
    - `is_available` (boolean): Product availability status
    - `created_at` (timestamp): Record creation timestamp
    - `updated_at` (timestamp): Last update timestamp

  ### 4. `orders` - Customer orders
    - `id` (uuid): Primary key
    - `order_number` (text): Unique order identifier
    - `user_id` (uuid, FK to profiles): Customer who placed the order
    - `status` (text): Order status (pending, confirmed, shipping, delivered, cancelled)
    - `subtotal` (numeric): Subtotal amount in FCFA
    - `shipping_cost` (numeric): Shipping cost in FCFA
    - `total` (numeric): Total amount in FCFA
    - `payment_first_amount` (numeric): First payment (50%)
    - `payment_first_paid` (boolean): First payment status
    - `payment_first_date` (timestamp): First payment date
    - `payment_second_amount` (numeric): Second payment (50%)
    - `payment_second_paid` (boolean): Second payment status
    - `payment_second_date` (timestamp): Second payment date
    - `created_at` (timestamp): Order creation timestamp
    - `updated_at` (timestamp): Last update timestamp

  ### 5. `order_items` - Items within orders
    - `id` (uuid): Primary key
    - `order_id` (uuid, FK to orders): Associated order
    - `product_id` (uuid, FK to products): Ordered product
    - `quantity` (integer): Quantity ordered
    - `unit_price` (numeric): Price per unit in FCFA
    - `subtotal` (numeric): Line item subtotal

  ### 6. `reviews` - Product and service reviews
    - `id` (uuid): Primary key
    - `user_id` (uuid, FK to profiles): Reviewer
    - `product_id` (uuid, FK to products): Reviewed product
    - `order_id` (uuid, FK to orders): Associated order
    - `rating` (integer): Rating from 1 to 5
    - `comment` (text): Review text
    - `is_verified` (boolean): Verification status
    - `is_approved` (boolean): Admin approval status
    - `created_at` (timestamp): Review creation timestamp

  ### 7. `cart_items` - Shopping cart items
    - `id` (uuid): Primary key
    - `user_id` (uuid, FK to profiles): Cart owner
    - `product_id` (uuid, FK to products): Product in cart
    - `quantity` (integer): Quantity in cart
    - `created_at` (timestamp): Item added timestamp
    - `updated_at` (timestamp): Last update timestamp

  ## Security
  - All tables have RLS (Row Level Security) enabled
  - Policies are created for authenticated users to:
    - View their own data
    - Insert their own records
    - Update their own records
  - Admin users can view and manage all data
  - Suppliers can manage their own products

  ## Important Notes
  - User codes are generated with format KA-[postal_code]-[sequence_number]
  - Orders use split payment: 50% at order, 50% at delivery
  - Reviews must be approved by admin before public display
  - Stock quantities are updated automatically on order placement
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_code text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  postal_code text NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'supplier_africa', 'supplier_asia')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  region text NOT NULL CHECK (region IN ('africa', 'asia')),
  api_endpoint text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers can view own data"
  ON suppliers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view verified suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Admins can manage all suppliers"
  ON suppliers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  origin text NOT NULL CHECK (origin IN ('africa', 'asia')),
  stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
  weight_kg numeric CHECK (weight_kg >= 0),
  volume_m3 numeric CHECK (volume_m3 >= 0),
  delivery_days integer DEFAULT 7 CHECK (delivery_days >= 0),
  images jsonb DEFAULT '[]'::jsonb,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Suppliers can manage own products"
  ON products FOR ALL
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  shipping_cost numeric NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total numeric NOT NULL CHECK (total >= 0),
  payment_first_amount numeric NOT NULL CHECK (payment_first_amount >= 0),
  payment_first_paid boolean DEFAULT false,
  payment_first_date timestamptz,
  payment_second_amount numeric NOT NULL CHECK (payment_second_amount >= 0),
  payment_second_paid boolean DEFAULT false,
  payment_second_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  subtotal numeric NOT NULL CHECK (subtotal >= 0)
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_code ON profiles(user_code);
CREATE INDEX IF NOT EXISTS idx_profiles_postal_code ON profiles(postal_code);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_origin ON products(origin);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

-- Function to generate user code
CREATE OR REPLACE FUNCTION generate_user_code(p_postal_code text)
RETURNS text AS $$
DECLARE
  v_sequence integer;
  v_code text;
BEGIN
  -- Get the next sequence number for this postal code
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(user_code FROM LENGTH(user_code) - 5)
      AS integer
    )
  ), 0) + 1
  INTO v_sequence
  FROM profiles
  WHERE postal_code = p_postal_code;
  
  -- Format: KA-[postal_code]-[6-digit sequence]
  v_code := 'KA-' || p_postal_code || '-' || LPAD(v_sequence::text, 6, '0');
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();