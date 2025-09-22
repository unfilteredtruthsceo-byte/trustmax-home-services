-- Clean up redundant storage policies and create helper for admin user creation

-- Remove redundant storage policies (keeping only necessary ones)
DROP POLICY IF EXISTS "Anyone can view package images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view service images" ON storage.objects;

-- Create more specific storage policies
CREATE POLICY "Public can view package images" ON storage.objects 
FOR SELECT USING (bucket_id = 'package-images');

CREATE POLICY "Public can view service images" ON storage.objects 
FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload package images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'package-images' AND is_admin());

CREATE POLICY "Admins can upload service images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'service-images' AND is_admin());

CREATE POLICY "Admins can update package images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'package-images' AND is_admin());

CREATE POLICY "Admins can update service images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'service-images' AND is_admin());

CREATE POLICY "Admins can delete package images" ON storage.objects 
FOR DELETE USING (bucket_id = 'package-images' AND is_admin());

CREATE POLICY "Admins can delete service images" ON storage.objects 
FOR DELETE USING (bucket_id = 'service-images' AND is_admin());

-- Create a helper function to add admin users easily
CREATE OR REPLACE FUNCTION public.add_admin_user(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get user ID from auth.users by email
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RETURN 'User not found with email: ' || user_email;
    END IF;
    
    -- Check if user already has admin role
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = 'admin') THEN
        RETURN 'User already has admin role';
    END IF;
    
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (user_uuid, 'admin');
    
    RETURN 'Admin role added successfully for user: ' || user_email;
END;
$$;