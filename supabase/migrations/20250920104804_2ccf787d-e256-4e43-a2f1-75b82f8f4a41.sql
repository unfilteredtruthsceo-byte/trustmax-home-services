-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('package-images', 'package-images', true),
  ('service-images', 'service-images', true);

-- Create storage policies for package images
CREATE POLICY "Package images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'package-images');

CREATE POLICY "Anyone can upload package images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Anyone can update package images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'package-images');

CREATE POLICY "Anyone can delete package images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'package-images');

-- Create storage policies for service images
CREATE POLICY "Service images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-images');

CREATE POLICY "Anyone can upload service images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'service-images');

CREATE POLICY "Anyone can update service images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'service-images');

CREATE POLICY "Anyone can delete service images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'service-images');