import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnquiries } from '@/hooks/useEnquiries';
import { Loader2, Palette } from 'lucide-react';

interface InteriorDesignDialogProps {
  children: React.ReactNode;
}

const roomTypes = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Dining Room',
  'Home Office',
  'Entire Home',
  'Commercial Space'
];

const designStyles = [
  'Modern',
  'Contemporary',
  'Traditional',
  'Minimalist',
  'Industrial',
  'Scandinavian',
  'Mid-Century Modern',
  'Rustic'
];

export function InteriorDesignDialog({ children }: InteriorDesignDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createEnquiry } = useEnquiries();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    room_type: '',
    design_style: '',
    budget: '',
    description: '',
    timeline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const enquiryDescription = `Interior Design Requirements:
Room Type: ${formData.room_type}
Design Style: ${formData.design_style}
Timeline: ${formData.timeline}
Additional Details: ${formData.description}`;

    const result = await createEnquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      location: formData.location,
      service_type: 'Interior Design',
      description: enquiryDescription,
      budget: formData.budget
    });

    if (result.success) {
      setShowSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        room_type: '',
        design_style: '',
        budget: '',
        description: '',
        timeline: ''
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
              <Palette className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Interior Design Request Submitted!</h3>
            <p className="text-muted-foreground">Our design expert will contact you soon to discuss your project.</p>
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
            <Palette className="w-5 h-5" />
            Book Interior Designer
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
            <Label htmlFor="room_type">Room/Space Type *</Label>
            <Select value={formData.room_type} onValueChange={(value) => handleInputChange('room_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="design_style">Preferred Design Style</Label>
            <Select value={formData.design_style} onValueChange={(value) => handleInputChange('design_style', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select design style" />
              </SelectTrigger>
              <SelectContent>
                {designStyles.map(style => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Expected Timeline</Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              placeholder="e.g., 2-3 months, ASAP, Flexible"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Requirements *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              placeholder="Describe your vision, specific requirements, preferences, or any existing furniture/fixtures to work with"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Range *</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              required
              placeholder="Enter your budget range (e.g., 1-2 Lakhs)"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Interior Design Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}