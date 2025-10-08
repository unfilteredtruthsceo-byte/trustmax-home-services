import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .rpc('is_admin', { user_uuid: userId });
        
        if (!error && mounted) {
          return data || false;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
      return false;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        const isAdmin = session?.user 
          ? await checkAdminStatus(session.user.id)
          : false;

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAdmin,
        });
      }
    );

    // Check initial session only once
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      const isAdmin = session?.user 
        ? await checkAdminStatus(session.user.id)
        : false;

      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        isAdmin,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    // Input validation
    if (!email.trim() || !password.trim()) {
      return { 
        data: null, 
        error: { message: 'Email and password are required' } 
      };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { 
        data: null, 
        error: { message: 'Please enter a valid email address' } 
      };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    return { data, error };
  };

  return {
    ...authState,
    signIn,
    signOut,
    signUp,
  };
}