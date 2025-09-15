import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnquiryDialog } from './EnquiryDialog';

interface Service {
  title: string;
  items: string[];
}

interface ServiceCardProps {
  service: Service;
  icon: string;
  index: number;
}

export function ServiceCard({ service, icon, index }: ServiceCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-smooth group hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="text-3xl group-hover:scale-110 transition-smooth">
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
              {service.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {service.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0"></div>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        
        <EnquiryDialog defaultService={service.title}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-elegant transition-smooth">
            Enquire Now
          </Button>
        </EnquiryDialog>
      </CardContent>
    </Card>
  );
}