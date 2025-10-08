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
        const timeoutPromise = new Promise<boolean>((resolve) => 
          setTimeout(() => resolve(false), 3000)
        );
        
        const checkPromise = supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle()
          .then(({ data, error }) => {
            if (!error && mounted) {
              return !!data;
            }
            return false;
          });
        
        return await Promise.race([checkPromise, timeoutPromise]);
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: true,
          isAdmin: false,
        });

        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id).then((isAdmin) => {
              if (mounted) {
                setAuthState({
                  user: session.user,
                  session,
                  loading: false,
                  isAdmin,
                });
              }
            });
          }, 0);
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false,
          });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        checkAdminStatus(session.user.id).then((isAdmin) => {
          if (mounted) {
            setAuthState({
              user: session.user,
              session,
              loading: false,
              isAdmin,
            });
          }
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAdmin: false,
        });
      }
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