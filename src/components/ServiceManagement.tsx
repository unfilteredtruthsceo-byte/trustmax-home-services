import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useServices, Service } from '@/hooks/useServices';
import { Plus, Edit2, Trash2, Settings, Image } from 'lucide-react';

export function ServiceManagement() {
  const { services, createService, updateService, deleteService, loading } = useServices();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    items: [] as string[],
    description: '',
    image_url: ''
  });
  const [itemsText, setItemsText] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      icon: '',
      items: [],
      description: '',
      image_url: ''
    });
    setItemsText('');
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const items = itemsText.split('\n').filter(item => item.trim() !== '');
    const serviceData = { ...formData, items };
    
    if (editingService) {
      await updateService(editingService.id, serviceData);
    } else {
      await createService(serviceData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      icon: service.icon,
      items: service.items,
      description: service.description || '',
      image_url: service.image_url || ''
    });
    setItemsText(service.items.join('\n'));
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Service Management</h2>
          <p className="text-muted-foreground">Manage service categories and descriptions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., 🛠️ Plumbing Services"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., 🛠️"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief service description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="text-xs text-muted-foreground">
                  Or upload to a service like Imgur, Cloudinary, or use a direct image URL
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="items">Service Items (one per line)</Label>
                <Textarea
                  id="items"
                  value={itemsText}
                  onChange={(e) => setItemsText(e.target.value)}
                  placeholder="Tap Installation & Repair&#10;Pipeline Leakage Fix&#10;Bathroom Setup"
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingService ? 'Update' : 'Create'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading services...</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      {service.title}
                    </CardTitle>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    )}
                    {service.image_url && (
                      <div className="flex items-center gap-2 mt-2">
                        <Image className="w-4 h-4" />
                        <span className="text-xs text-muted-foreground">Has image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">{service.items.length} services</Badge>
                  <div className="text-sm text-muted-foreground">
                    {service.items.slice(0, 3).map((item, idx) => (
                      <div key={idx}>• {item}</div>
                    ))}
                    {service.items.length > 3 && (
                      <div>... and {service.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}