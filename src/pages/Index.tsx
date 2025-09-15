import { Header } from '@/components/Header';
import { ServiceCard } from '@/components/ServiceCard';
import { PackageCard } from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePackages } from '@/hooks/usePackages';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { Phone, MessageCircle, Star, Award, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: "🛠️ Plumbing Services",
    icon: "🛠️",
    items: [
      "Tap / Shower / Mixer Installation & Repair",
      "Pipeline Leakage Fix",
      "Bathroom Setup (New Construction)",
      "Water Tank Installation / Cleaning",
      "Motor/Pump Installation",
      "Geyser Installation"
    ]
  },
  {
    title: "💡 Electrical Services", 
    icon: "💡",
    items: [
      "House Wiring (Full / Partial)",
      "Switchboard Installation & Repair",
      "Fan / Light / Chandelier Installation",
      "Inverter Wiring Setup",
      "Power Backup Wiring",
      "Short Circuit Fix"
    ]
  },
  {
    title: "🧱 Masonry & Civil Works",
    icon: "🧱", 
    items: [
      "Brick Wall Construction",
      "Wall Repairs / Plastering",
      "Compound Wall Construction",
      "Floor Extension (add room/floor)",
      "Cement Slab Work"
    ]
  },
  {
    title: "🏠 Tiles & Flooring",
    icon: "🏠",
    items: [
      "Tile Laying (Bathroom / Kitchen / Full House)",
      "Marble / Granite Work",
      "Tile Replacements",
      "Tile Polishing"
    ]
  },
  {
    title: "🎨 Painting & Finishing",
    icon: "🎨",
    items: [
      "Interior Wall Painting",
      "Exterior Painting", 
      "Waterproof Coating",
      "Wall Putty Work",
      "Texture / Stencil Painting"
    ]
  },
  {
    title: "🪚 Carpentry & Woodwork",
    icon: "🪚",
    items: [
      "Door / Window Frame Installation",
      "Door Designing & Polishing",
      "Cupboard/Wardrobe Making",
      "Modular Kitchen",
      "Furniture Repair"
    ]
  },
  {
    title: "🔩 Fabrication & Metal Work",
    icon: "🔩", 
    items: [
      "Steel / MS / SS Railings",
      "Grills & Gates",
      "Shed / Roofing",
      "Rolling Shutters"
    ]
  },
  {
    title: "🛋️ Interior & Aesthetic Work",
    icon: "🛋️",
    items: [
      "False Ceiling",
      "POP Design",
      "Wall Partitions",
      "Wallpaper / 3D Panel Installation",
      "Lighting Design"
    ]
  },
  {
    title: "🌳 Plot & Outdoor Services",
    icon: "🌳",
    items: [
      "Plot Cleaning (Manual / JCB)",
      "Borewell Drilling & Repair",
      "Landscaping & Gardening", 
      "Water Tank / Septic Tank Cleaning"
    ]
  },
  {
    title: "👷 Worker Contracts",
    icon: "👷",
    items: [
      "Mason Daily/Monthly Contract",
      "Painter Contract",
      "Carpenter Contract", 
      "General Labor Supply"
    ]
  },
  {
    title: "🏗️ Complete Construction",
    icon: "🏗️",
    items: [
      "Full House Construction (Turnkey)",
      "Renovation (Kitchen/Bathroom/Full House)",
      "Independent House Extension (Extra Floor)",
      "Interior Design + Execution"
    ]
  }
];

const Index = () => {
  const { packages, loading: packagesLoading } = usePackages();
  
  const handleCall = () => {
    window.open('tel:+919182498628', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919182498628', '_blank');
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                icon={service.icon}
                index={index}
              />
            ))}
          </div>
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

      {/* Admin Link (hidden in plain sight) */}
      <div className="text-center py-4 bg-muted/50">
        <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Index;
