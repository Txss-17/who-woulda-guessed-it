
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour nettoyer l'état d'authentification
  const cleanupAuthState = () => {
    // Nettoyer localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Nettoyer sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  };

  useEffect(() => {
    // Vérifier la session actuelle au démarrage
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          cleanupAuthState();
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation auth:', error);
        cleanupAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Gestion des différents événements d'authentification
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            toast.success(`Bienvenue ${session.user.email} ! 🎉`);
            
            // Redirection automatique vers le dashboard après connexion
            setTimeout(() => {
              if (window.location.pathname === '/auth') {
                window.location.href = '/dashboard';
              }
            }, 1500);
          }
          break;

        case 'SIGNED_OUT':
          cleanupAuthState();
          setSession(null);
          setUser(null);
          toast.info('Vous avez été déconnecté');
          
          // Redirection vers la page d'authentification
          if (window.location.pathname !== '/auth' && window.location.pathname !== '/') {
            window.location.href = '/auth';
          }
          break;

        case 'TOKEN_REFRESHED':
          console.log('Token rafraîchi');
          break;

        case 'USER_UPDATED':
          console.log('Utilisateur mis à jour');
          break;

        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction de déconnexion robuste
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Nettoyer l'état local d'abord
      cleanupAuthState();
      
      // Tentative de déconnexion globale
      await supabase.auth.signOut({ scope: 'global' });
      
      // Forcer le rechargement de la page pour un état propre
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, forcer la déconnexion côté client
      setSession(null);
      setUser(null);
      window.location.href = '/auth';
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
    isEmailConfirmed: user?.email_confirmed_at != null
  };
};
