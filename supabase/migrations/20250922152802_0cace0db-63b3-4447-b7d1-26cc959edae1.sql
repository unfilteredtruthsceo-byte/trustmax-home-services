-- Fix search_path security issue
CREATE OR REPLACE FUNCTION public.add_admin_user(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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