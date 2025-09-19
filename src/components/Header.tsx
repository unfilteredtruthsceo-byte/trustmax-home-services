import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Wrench } from 'lucide-react';
import { EnquiryDialog } from './EnquiryDialog';

export function Header() {
  const handleCall = () => {
    window.open('tel:+919182498628', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://ultramsg.com/m/46uLKXg', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">TrustMax</h1>
              <p className="text-sm text-muted-foreground">Home Services Expert</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCall}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 border-primary/20 hover:bg-primary/10"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white hidden sm:flex items-center gap-2"
              size="sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            <EnquiryDialog>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Quote
              </Button>
            </EnquiryDialog>

            {/* Mobile buttons */}
            <div className="flex sm:hidden gap-2">
              <Button onClick={handleCall} size="icon" variant="outline">
                <Phone className="w-4 h-4" />
              </Button>
              <Button onClick={handleWhatsApp} size="icon" className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}