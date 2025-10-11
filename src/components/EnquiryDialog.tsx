import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnquiries } from '@/hooks/useEnquiries';
import { LocationInput } from './LocationInput';
import { Loader2, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnquiryDialogProps {
  children: React.ReactNode;
  defaultService?: string;
  enquiryType?: 'general' | 'package' | 'interior_design' | 'consultation';
  packageName?: string;
}

const serviceOptions = [
  'Plumbing Services',
  'Electrical Services', 
  'Masonry & Civil Works',
  'Tiles & Flooring',
  'Painting & Finishing',
  'Carpentry & Woodwork',
  'Fabrication & Metal Work',
  'Interior & Aesthetic Work',
  'Plot & Outdoor Services',
  'Worker Contracts',
  'Complete Construction'
];

export function EnquiryDialog({ children, defaultService, enquiryType = 'general', packageName }: EnquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createEnquiry } = useEnquiries();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service_type: defaultService || '',
    description: '',
    budget: '',
    customer_image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createEnquiry({
      ...formData,
      email: formData.email || undefined,
      customer_image_url: formData.customer_image_url || undefined,
      enquiry_type: enquiryType
    });

    if (result.success) {
      setShowSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        service_type: defaultService || '',
        description: '',
        budget: '',
        customer_image_url: ''
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        setOpen(false);
      }, 3000);
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `customer-enquiry-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, customer_image_url: publicUrl }));

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, customer_image_url: '' }));
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Enquiry Submitted Successfully!</h3>
            <p className="text-muted-foreground">Our representative will contact you soon.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {enquiryType === 'package' && packageName ? `Quote for ${packageName}` : 'Get Free Quote'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <LocationInput
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              required
            />
          </div>

          {enquiryType !== 'package' && (
            <div className="space-y-2">
              <Label htmlFor="service">Service Required *</Label>
              <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">
              {enquiryType === 'package' ? 'Additional Requirements' : 'Work Description'} *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              placeholder={
                enquiryType === 'package' 
                  ? 'Any specific requirements or modifications needed for this package'
                  : 'Describe the work you need done'
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              placeholder="Enter your budget range"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Attach Image (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Upload a reference image or photo of the area/item
            </p>
            {formData.customer_image_url ? (
              <div className="relative">
                <img
                  src={formData.customer_image_url}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Enquiry'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}