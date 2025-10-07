import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Package {
  id: string;
  service_category: string;
  package_name: string;
  description: string;
  pricing: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPackages = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('service_category', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (err: any) {
      // Retry once if it's a network/connection error
      if (retryCount < 1 && (err.message?.includes('Failed to fetch') || err.message?.includes('network'))) {
        setTimeout(() => fetchPackages(retryCount + 1), 1000);
        return;
      }
      
      setError(err.message);
      console.error('Failed to fetch packages:', err);
      toast({
        title: "Error",
        description: "Failed to load packages. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (packageData: Omit<Package, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([packageData])
        .select()
        .single();

      if (error) throw error;
      
      setPackages(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Package created successfully!",
      });
      return { success: true, data };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    }
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPackages(prev => prev.map(pkg => 
        pkg.id === id ? { ...pkg, ...data } : pkg
      ));
      
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
      return { success: true, data };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      return { success: true };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    error,
    createPackage,
    updatePackage,
    deletePackage,
    refetch: fetchPackages,
  };
}