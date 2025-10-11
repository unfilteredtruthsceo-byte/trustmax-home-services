import { Header } from '@/components/Header';
import { ServiceCard } from '@/components/ServiceCard';
import { PackageCard } from '@/components/PackageCard';
import { CategoryHeroSection } from '@/components/CategoryHeroSection';
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      
      {/* Category Hero Section */}
      <CategoryHeroSection />
      
      {/* Hero Section */}
      <section className="gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
            Professional Home Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            From plumbing to complete construction - we handle all your home improvement needs with expert craftsmanship and reliable service.
          </p>

          {/* Quick Navigation Buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center mb-8 animate-fade-in">
            <Button 
              onClick={() => scrollToSection('services-section')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant text-lg px-8 py-6 hover-scale"
            >
              <Star className="w-5 h-5 mr-2" />
              View Our Services
            </Button>
            <Button 
              onClick={() => scrollToSection('packages-section')}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant text-lg px-8 py-6 hover-scale"
            >
              <Award className="w-5 h-5 mr-2" />
              View Packages
            </Button>
          </div>
          
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
      <section id="services-section" className="py-16 px-4 scroll-mt-20">
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
      <section id="packages-section" className="py-16 px-4 bg-muted/30 scroll-mt-20">
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

      {/* Why Choose Tivup - Unique Value Proposition */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose Tivup?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the difference with our innovative approach to home services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-elegant hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Instant Coupon Redemption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your coupon codes are redeemed directly at your location by our executive partner. No hassle, no waiting - just instant savings on the spot!
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-elegant hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Verified Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every technician is thoroughly vetted, certified, and background-checked. We only send the best to your home, guaranteed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-elegant hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="text-xl">Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We stand behind our work with a comprehensive warranty. If you are not 100% satisfied, we will make it right - no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-elegant hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Same-Day Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Emergency? No problem! We offer same-day service for urgent repairs. Your comfort and safety are our top priorities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-elegant hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Badge className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Transparent Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No hidden fees, no surprise charges. Get upfront quotes and detailed breakdowns before any work begins. What you see is what you pay.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-elegant hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track your service request in real-time via WhatsApp. Know exactly when our team will arrive and get instant notifications at every step.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Special Highlight Box */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-primary mb-2">Exclusive Coupon Benefits</h3>
                    <p className="text-muted-foreground text-lg">
                      All coupon codes are verified and redeemed instantly at your doorstep by our executive partner. 
                      No scanning, no apps needed - just show your code and save! It is that simple.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
          © 2025 Tivup. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Index;
