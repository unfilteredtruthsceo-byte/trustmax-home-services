import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  service_type: string;
  description: string;
  budget?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  assigned_worker?: string;
  enquiry_type: 'general' | 'package' | 'interior_design' | 'consultation';
  customer_image_url?: string;
  created_at: string;
  updated_at: string;
}

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries((data || []) as Enquiry[]);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch enquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([enquiryData])
        .select()
        .single();

      if (error) throw error;
      
      setEnquiries(prev => [data as Enquiry, ...prev]);
      toast({
        title: "Success",
        description: "Your enquiry has been submitted successfully!",
      });
      return { success: true, data };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    }
  };

  const updateEnquiry = async (id: string, updates: Partial<Enquiry>) => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEnquiries(prev => prev.map(enquiry => 
        enquiry.id === id ? { ...enquiry, ...(data as Enquiry) } : enquiry
      ));
      
      toast({
        title: "Success",
        description: "Enquiry updated successfully",
      });
      return { success: true, data };
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update enquiry",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return {
    enquiries,
    loading,
    error,
    createEnquiry,
    updateEnquiry,
    refetch: fetchEnquiries,
  };
}