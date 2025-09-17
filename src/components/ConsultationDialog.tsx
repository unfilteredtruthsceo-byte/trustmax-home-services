import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnquiries } from '@/hooks/useEnquiries';
import { Loader2, UserCheck } from 'lucide-react';

interface ConsultationDialogProps {
  children: React.ReactNode;
}

const consultationSectors = [
  'Construction & Building',
  'Home Renovation',
  'Plumbing & Electrical',
  'Interior Design',
  'Property Development',
  'Legal & Documentation',
  'Vastu Consultation',
  'Cost Estimation',
  'Material Selection',
  'Project Planning'
];

const urgencyLevels = [
  'Urgent (Within 24 hours)',
  'High (Within 3 days)',
  'Medium (Within a week)',
  'Low (Flexible timing)'
];

export function ConsultationDialog({ children }: ConsultationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createEnquiry } = useEnquiries();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    consultation_sector: '',
    urgency: '',
    description: '',
    preferred_time: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const enquiryDescription = `Consultation Requirements:
Sector: ${formData.consultation_sector}
Urgency: ${formData.urgency}
Preferred Time: ${formData.preferred_time}
Details: ${formData.description}`;

    const result = await createEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      location: formData.location,
      service_type: 'Consultation',
      description: enquiryDescription
    });

    if (result.success) {
      setShowSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        consultation_sector: '',
        urgency: '',
        description: '',
        preferred_time: ''
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
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Consultation Request Submitted!</h3>
            <p className="text-muted-foreground">Our expert will contact you soon to schedule your consultation.</p>
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
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Book Consultation
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
            <Label htmlFor="location">Exact Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
              placeholder="Enter your complete address with landmarks"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_sector">What sector do you need help with? *</Label>
            <Select value={formData.consultation_sector} onValueChange={(value) => handleInputChange('consultation_sector', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select consultation area" />
              </SelectTrigger>
              <SelectContent>
                {consultationSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level *</Label>
            <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_time">Preferred Consultation Time</Label>
            <Input
              id="preferred_time"
              value={formData.preferred_time}
              onChange={(e) => handleInputChange('preferred_time', e.target.value)}
              placeholder="e.g., Weekday evenings, Weekend mornings"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">What issues or questions do you have? *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              placeholder="Describe your specific questions, challenges, or what you'd like to discuss during the consultation"
              rows={4}
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
              'Submit Consultation Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}