-- Create products table for furniture, decor, and other items
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  stock_status TEXT DEFAULT 'available',
  specifications JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images');

-- Add image_url column to enquiries table for customer uploads
ALTER TABLE public.enquiries 
ADD COLUMN IF NOT EXISTS customer_image_url TEXT;