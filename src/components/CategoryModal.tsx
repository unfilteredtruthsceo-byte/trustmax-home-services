import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useServices } from '@/hooks/useServices';
import { usePackages } from '@/hooks/usePackages';
import { useProducts } from '@/hooks/useProducts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ItemDetailModal } from './ItemDetailModal';

interface CategoryModalProps {
  category: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
  const { services, loading: servicesLoading } = useServices();
  const { packages, loading: packagesLoading } = usePackages();
  const { products, loading: productsLoading } = useProducts();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemType, setItemType] = useState<string>('');

  const getItems = () => {
    switch (category) {
      case 'services':
        return { items: services, loading: servicesLoading, type: 'service' };
      case 'packages':
        return { items: packages, loading: packagesLoading, type: 'package' };
      case 'products':
        return { items: products, loading: productsLoading, type: 'product' };
      default:
        return { items: [], loading: false, type: '' };
    }
  };

  const { items, loading, type } = getItems();

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setItemType(type);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl capitalize">{category}</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {items.map((item: any) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  {item.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title || item.package_name || item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">
                      {item.title || item.package_name || item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    {item.pricing && (
                      <p className="text-sm font-semibold text-primary">{item.pricing}</p>
                    )}
                    {item.price && (
                      <p className="text-sm font-semibold text-primary">{item.price}</p>
                    )}
                    <Button className="w-full mt-3" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ItemDetailModal
        item={selectedItem}
        itemType={itemType}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}