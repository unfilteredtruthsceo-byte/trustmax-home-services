import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnquiryDialog } from './EnquiryDialog';
import { Package } from '@/hooks/usePackages';

interface PackageCardProps {
  package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-smooth group hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
          {pkg.package_name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {pkg.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg border border-border/30">
          <div className="text-sm text-muted-foreground mb-1">Pricing</div>
          <div className="text-lg font-semibold text-primary">{pkg.pricing}</div>
        </div>
        
        <EnquiryDialog 
          defaultService={pkg.service_category}
          enquiryType="package"
          packageName={pkg.package_name}
        >
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-elegant transition-smooth">
            Get Quote
          </Button>
        </EnquiryDialog>
      </CardContent>
    </Card>
  );
}