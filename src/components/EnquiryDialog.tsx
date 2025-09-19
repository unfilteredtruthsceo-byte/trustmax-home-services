import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnquiries } from '@/hooks/useEnquiries';
import { LocationInput } from './LocationInput';
import { Loader2 } from 'lucide-react';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const { createEnquiry } = useEnquiries();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service_type: defaultService || '',
    description: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createEnquiry({
      ...formData,
      email: formData.email || undefined,
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
        budget: ''
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