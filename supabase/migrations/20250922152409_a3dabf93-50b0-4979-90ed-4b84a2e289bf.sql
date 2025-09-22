-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_uuid AND role = 'admin'
    );
$$;

-- Drop existing public policies for enquiries
DROP POLICY IF EXISTS "Anyone can create enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Anyone can update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Anyone can view enquiries" ON public.enquiries;

-- Create admin-only policies for enquiries
CREATE POLICY "Only admins can view enquiries" 
ON public.enquiries 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can create enquiries" 
ON public.enquiries 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update enquiries" 
ON public.enquiries 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

-- Drop existing public policies for packages
DROP POLICY IF EXISTS "Anyone can create packages" ON public.packages;
DROP POLICY IF EXISTS "Anyone can update packages" ON public.packages;
DROP POLICY IF EXISTS "Anyone can view packages" ON public.packages;
DROP POLICY IF EXISTS "Anyone can delete packages" ON public.packages;

-- Create policies for packages (admin for management, public for viewing)
CREATE POLICY "Anyone can view packages" 
ON public.packages 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create packages" 
ON public.packages 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update packages" 
ON public.packages 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete packages" 
ON public.packages 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Drop existing public policies for services
DROP POLICY IF EXISTS "Anyone can create services" ON public.services;
DROP POLICY IF EXISTS "Anyone can update services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
DROP POLICY IF EXISTS "Anyone can delete services" ON public.services;

-- Create policies for services (admin for management, public for viewing)
CREATE POLICY "Anyone can view services" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create services" 
ON public.services 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update services" 
ON public.services 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete services" 
ON public.services 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.is_admin());

-- Update storage policies to require admin access for package and service image management
DROP POLICY IF EXISTS "Public can view package images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload package images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update package images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete package images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update service images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete service images" ON storage.objects;

-- Create secure storage policies
CREATE POLICY "Anyone can view package images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'package-images');

CREATE POLICY "Only admins can upload package images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'package-images' AND public.is_admin());

CREATE POLICY "Only admins can update package images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'package-images' AND public.is_admin());

CREATE POLICY "Only admins can delete package images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'package-images' AND public.is_admin());

CREATE POLICY "Anyone can view service images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-images');

CREATE POLICY "Only admins can upload service images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'service-images' AND public.is_admin());

CREATE POLICY "Only admins can update service images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'service-images' AND public.is_admin());

CREATE POLICY "Only admins can delete service images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'service-images' AND public.is_admin());