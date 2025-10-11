import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image_url?: string | null;
  images?: any;
  stock_status?: string | null;
  specifications?: any;
  created_at?: string;
  updated_at?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching products",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      await fetchProducts();
      return data;
    } catch (err: any) {
      toast({
        title: "Error creating product",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      await fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error updating product",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error deleting product",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}