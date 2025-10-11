import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnquiryDialog } from './EnquiryDialog';

interface ItemDetailModalProps {
  item: any;
  itemType: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, itemType, isOpen, onClose }: ItemDetailModalProps) {
  if (!item) return null;

  const getTitle = () => {
    return item.title || item.package_name || item.name || 'Details';
  };

  const getImages = () => {
    const images = [];
    if (item.image_url) images.push(item.image_url);
    if (item.images && Array.isArray(item.images)) {
      images.push(...item.images);
    }
    return images;
  };

  const images = getImages();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl">{getTitle()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Images Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-video relative overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`${getTitle()} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            {/* Items/Features (for services) */}
            {item.items && Array.isArray(item.items) && item.items.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {item.items.map((feature: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            {(item.pricing || item.price) && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Pricing</h3>
                <p className="text-2xl font-bold text-primary">
                  {item.pricing || item.price}
                </p>
              </div>
            )}

            {/* Category (for products) */}
            {item.category && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Category</h3>
                <Badge>{item.category}</Badge>
              </div>
            )}

            {/* Stock Status (for products) */}
            {item.stock_status && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Availability</h3>
                <Badge variant={item.stock_status === 'available' ? 'default' : 'secondary'}>
                  {item.stock_status}
                </Badge>
              </div>
            )}

            {/* Specifications (for products) */}
            {item.specifications && Object.keys(item.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Specifications</h3>
                <div className="space-y-1">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <EnquiryDialog defaultService={getTitle()}>
              <Button 
                className="w-full" 
                size="lg"
              >
                Get Quote / Enquire Now
              </Button>
            </EnquiryDialog>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}