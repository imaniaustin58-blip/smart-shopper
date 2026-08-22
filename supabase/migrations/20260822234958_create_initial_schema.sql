/*
# Create PricePair initial schema

Creates the core tables for the Smart Shopper price-comparison prototype:
products, offers (per-retailer pricing), price history, shopping list items,
and tracked products (price alerts). Seeds the four sample products currently
hard-coded in src/data/products.ts so the UI can later switch to live DB reads.

This is a single-tenant prototype with NO sign-in screen, so all policies are
scoped to `anon, authenticated` and the data is intentionally shared/public.

1. New Tables
- `products` — a product group (e.g. "Tide Original 92oz") that can have
  multiple retailer offers.
  - id (text, primary key; matches the existing slug-style ids in the UI)
  - name (text, not null)
  - brand (text, not null)
  - category (text, not null)
  - image (text; URL or imported asset path)
  - keywords (text[]; for search)
  - store_brand_tip (text, nullable)
- `offers` — a single retailer's price for a product.
  - id (text, primary key)
  - product_id (text, FK -> products.id ON DELETE CASCADE)
  - retailer (text, "Walmart" | "Target")
  - price (numeric(10,2), not null)
  - size (text, not null)
  - unit_count (numeric(10,2), not null)
  - unit_label (text, not null)
  - on_sale (boolean, default false)
  - was_price (numeric(10,2), nullable)
  - url (text, not null)
- `price_history` — monthly price snapshots per product.
  - id (uuid, primary key)
  - product_id (text, FK -> products.id ON DELETE CASCADE)
  - label (text, not null; e.g. "Mar")
  - walmart_price (numeric(10,2), not null)
  - target_price (numeric(10,2), not null)
- `shopping_list` — products the user has added to their list.
  - id (uuid, primary key)
  - product_id (text, FK -> products.id ON DELETE CASCADE)
  - created_at (timestamptz, default now())
- `tracked_products` — products the user is watching for price drops.
  - id (uuid, primary key)
  - product_id (text, FK -> products.id ON DELETE CASCADE)
  - created_at (timestamptz, default now())

2. Security
- Enable RLS on every table.
- All tables use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant prototype with no sign-in and all data is
  intentionally public/shared.

3. Indexes
- offers(product_id)
- price_history(product_id)
- shopping_list(product_id)
- tracked_products(product_id)

4. Seed data
- Inserts the four sample products, their offers, and price history rows
  that currently live in src/data/products.ts. Uses ON CONFLICT DO NOTHING
  so re-running is safe.
*/

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  store_brand_tip text
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- offers ----------
CREATE TABLE IF NOT EXISTS offers (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer text NOT NULL,
  price numeric(10,2) NOT NULL,
  size text NOT NULL,
  unit_count numeric(10,2) NOT NULL,
  unit_label text NOT NULL,
  on_sale boolean NOT NULL DEFAULT false,
  was_price numeric(10,2),
  url text NOT NULL
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_offers" ON offers;
CREATE POLICY "anon_select_offers" ON offers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_offers" ON offers;
CREATE POLICY "anon_insert_offers" ON offers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_offers" ON offers;
CREATE POLICY "anon_update_offers" ON offers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_offers" ON offers;
CREATE POLICY "anon_delete_offers" ON offers FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- price_history ----------
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label text NOT NULL,
  walmart_price numeric(10,2) NOT NULL,
  target_price numeric(10,2) NOT NULL
);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_price_history" ON price_history;
CREATE POLICY "anon_select_price_history" ON price_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_price_history" ON price_history;
CREATE POLICY "anon_insert_price_history" ON price_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_price_history" ON price_history;
CREATE POLICY "anon_update_price_history" ON price_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_price_history" ON price_history;
CREATE POLICY "anon_delete_price_history" ON price_history FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- shopping_list ----------
CREATE TABLE IF NOT EXISTS shopping_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_shopping_list" ON shopping_list;
CREATE POLICY "anon_select_shopping_list" ON shopping_list FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_shopping_list" ON shopping_list;
CREATE POLICY "anon_insert_shopping_list" ON shopping_list FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_shopping_list" ON shopping_list;
CREATE POLICY "anon_update_shopping_list" ON shopping_list FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_shopping_list" ON shopping_list;
CREATE POLICY "anon_delete_shopping_list" ON shopping_list FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- tracked_products ----------
CREATE TABLE IF NOT EXISTS tracked_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tracked_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tracked_products" ON tracked_products;
CREATE POLICY "anon_select_tracked_products" ON tracked_products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tracked_products" ON tracked_products;
CREATE POLICY "anon_insert_tracked_products" ON tracked_products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tracked_products" ON tracked_products;
CREATE POLICY "anon_update_tracked_products" ON tracked_products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tracked_products" ON tracked_products;
CREATE POLICY "anon_delete_tracked_products" ON tracked_products FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_product_id ON shopping_list(product_id);
CREATE INDEX IF NOT EXISTS idx_tracked_products_product_id ON tracked_products(product_id);

-- ---------- seed data ----------
INSERT INTO products (id, name, brand, category, image, keywords, store_brand_tip) VALUES
  ('tide-original-92oz', 'Original Liquid Laundry Detergent', 'Tide', 'Laundry',
   '/src/assets/detergent.jpg',
   ARRAY['tide','laundry','detergent','soap'],
   'Great Value Original Detergent, 100 oz — $9.98 ($0.10/oz)'),
  ('coke-12pack', 'Coca-Cola Classic 12 Pack Cans', 'Coca-Cola', 'Beverages',
   '/src/assets/cola.jpg',
   ARRAY['coca','cola','coke','soda','12 pack','pop'],
   'Good & Gather Cola 12 pack — $4.99 ($0.42/can)'),
  ('bounty-paper-towels', 'Select-A-Size Paper Towels', 'Bounty', 'Paper Goods',
   '/src/assets/papertowels.jpg',
   ARRAY['bounty','paper','towels','kitchen'],
   'Up & Up Paper Towels, 8 rolls — $10.99 ($1.37/roll)'),
  ('dove-body-wash', 'Deep Moisture Body Wash', 'Dove', 'Personal Care',
   '/src/assets/bodywash.jpg',
   ARRAY['dove','body','wash','shower','soap'],
   'Equate Deep Moisture Body Wash, 22 oz — $4.47 ($0.20/oz)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO offers (id, product_id, retailer, price, size, unit_count, unit_label, on_sale, was_price, url) VALUES
  ('tide-w', 'tide-original-92oz', 'Walmart', 19.97, '92 fl oz (64 loads)', 92, 'fl oz', false, NULL, 'https://www.walmart.com'),
  ('tide-t', 'tide-original-92oz', 'Target',  17.49, '84 fl oz (59 loads)', 84, 'fl oz', true, 20.99, 'https://www.target.com'),
  ('coke-w', 'coke-12pack', 'Walmart', 8.98, '12 cans × 12 fl oz', 12, 'can', false, NULL, 'https://www.walmart.com'),
  ('coke-t', 'coke-12pack', 'Target',  9.49, '12 cans × 12 fl oz', 12, 'can', true, 10.99, 'https://www.target.com'),
  ('bounty-w', 'bounty-paper-towels', 'Walmart', 24.94, '12 double rolls', 12, 'roll', true, 27.94, 'https://www.walmart.com'),
  ('bounty-t', 'bounty-paper-towels', 'Target',  21.99, '8 double rolls',  8, 'roll', false, NULL, 'https://www.target.com'),
  ('dove-w', 'dove-body-wash', 'Walmart', 8.47, '22 fl oz', 22, 'fl oz', false, NULL, 'https://www.walmart.com'),
  ('dove-t', 'dove-body-wash', 'Target',  9.29, '22 fl oz', 22, 'fl oz', false, NULL, 'https://www.target.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO price_history (product_id, label, walmart_price, target_price) VALUES
  ('tide-original-92oz', 'Mar', 21.44, 20.99),
  ('tide-original-92oz', 'Apr', 20.97, 20.99),
  ('tide-original-92oz', 'May', 19.97, 19.49),
  ('tide-original-92oz', 'Jun', 19.97, 17.49),
  ('coke-12pack', 'Mar', 9.48, 10.99),
  ('coke-12pack', 'Apr', 9.28, 10.49),
  ('coke-12pack', 'May', 8.98, 10.99),
  ('coke-12pack', 'Jun', 8.98, 9.49),
  ('bounty-paper-towels', 'Mar', 27.94, 22.99),
  ('bounty-paper-towels', 'Apr', 26.44, 22.99),
  ('bounty-paper-towels', 'May', 24.94, 21.99),
  ('bounty-paper-towels', 'Jun', 24.94, 21.99),
  ('dove-body-wash', 'Mar', 8.97, 9.29),
  ('dove-body-wash', 'Apr', 8.47, 9.29),
  ('dove-body-wash', 'May', 8.47, 8.99),
  ('dove-body-wash', 'Jun', 8.47, 9.29)
ON CONFLICT DO NOTHING;
