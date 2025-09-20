import { Header } from '@/components/Header';
import { ServiceCard } from '@/components/ServiceCard';
import { PackageCard } from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePackages } from '@/hooks/usePackages';
import { useServices } from '@/hooks/useServices';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { InteriorDesignDialog } from '@/components/InteriorDesignDialog';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { Phone, MessageCircle, Star, Award, Users, Clock, Palette, UserCheck } from 'lucide-react';

const Index = () => {
  const { packages, loading: packagesLoading } = usePackages();
  const { services, loading: servicesLoading } = useServices();
  
  const handleCall = () => {
    window.open('tel:+919182498628', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://alvo.chat/6DB4', '_blank');
  };

  // Group packages by service category
  const packagesByCategory = packages.reduce((acc, pkg) => {
    if (!acc[pkg.service_category]) {
      acc[pkg.service_category] = [];
    }
    acc[pkg.service_category].push(pkg);
    return acc;
  }, {} as Record<string, typeof packages>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
            Professional Home Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            From plumbing to complete construction - we handle all your home improvement needs with expert craftsmanship and reliable service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in mb-6">
            <EnquiryDialog>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
                Get Free Quote
              </Button>
            </EnquiryDialog>
            
            <Button 
              onClick={handleCall}
              variant="outline" 
              size="lg"
              className="border-primary/20 hover:bg-primary/10"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: 91824 98628
            </Button>
          </div>

          {/* Special Service Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <EnquiryDialog enquiryType="interior_design">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant"
              >
                <Palette className="w-5 h-5 mr-2" />
                Book Interior Designer
              </Button>
            </EnquiryDialog>
            
            <EnquiryDialog enquiryType="consultation">
              <Button 
                variant="outline"
                size="lg"
                className="border-accent/20 hover:bg-accent/10"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Book Consultation
              </Button>
            </EnquiryDialog>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-lg border border-border/30">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium">500+ Happy Customers</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-lg border border-border/30">
              <Award className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Licensed & Insured</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-lg border border-border/30">
              <Clock className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete home service solutions under one roof. Quality work, transparent pricing, and reliable service guaranteed.
            </p>
          </div>

          {servicesLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  icon={service.icon}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Service Packages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready-to-go packages with transparent pricing for common home service needs.
            </p>
          </div>

          {packagesLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading packages...</div>
          ) : (
            <div className="space-y-12">
              {Object.entries(packagesByCategory).map(([category, categoryPackages]) => (
                <div key={category}>
                  <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                      {category}
                    </Badge>
                    <span className="text-lg text-muted-foreground">
                      ({categoryPackages.length} packages)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPackages.map((pkg) => (
                      <PackageCard key={pkg.id} package={pkg} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 gradient-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Get in touch with our experts today for a free consultation and quote.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <EnquiryDialog>
              <Button size="lg" variant="outline" className="bg-background text-primary border-background hover:bg-background/90">
                Get Free Estimate
              </Button>
            </EnquiryDialog>
            
            <Button 
              onClick={handleWhatsApp}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-4 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          © 2025 TrustMax. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Index;
