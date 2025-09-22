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
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        let isAdmin = false;
        
        if (session?.user) {
          // Check if user is admin
          try {
            const { data, error } = await supabase
              .rpc('is_admin', { user_uuid: session.user.id });
            
            if (!error) {
              isAdmin = data || false;
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
          }
        }

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAdmin,
        });
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let isAdmin = false;
      
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .rpc('is_admin', { user_uuid: session.user.id });
          
          if (!error) {
            isAdmin = data || false;
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }

      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        isAdmin,
      });
    });

    return () => subscription.unsubscribe();
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