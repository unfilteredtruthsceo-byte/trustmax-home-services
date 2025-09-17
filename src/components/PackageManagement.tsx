import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { usePackages, Package } from '@/hooks/usePackages';
import { Plus, Edit2, Trash2, Package2, Image } from 'lucide-react';

const serviceCategories = [
  "Plumbing", "Electrical", "Masonry", "Tiles & Flooring", 
  "Painting", "Carpentry", "Fabrication", "Interior", 
  "Plot Services", "AMC"
];

export function PackageManagement() {
  const { packages, createPackage, updatePackage, deletePackage, loading } = usePackages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    service_category: '',
    package_name: '',
    description: '',
    pricing: '',
    image_url: ''
  });

  const resetForm = () => {
    setFormData({
      service_category: '',
      package_name: '',
      description: '',
      pricing: '',
      image_url: ''
    });
    setEditingPackage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPackage) {
      await updatePackage(editingPackage.id, formData);
    } else {
      await createPackage(formData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      service_category: pkg.service_category,
      package_name: pkg.package_name,
      description: pkg.description,
      pricing: pkg.pricing,
      image_url: (pkg as any).image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      await deletePackage(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Package Management</h2>
          <p className="text-muted-foreground">Manage service packages and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service_category">Service Category</Label>
                <Select 
                  value={formData.service_category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, service_category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package_name">Package Name</Label>
                <Input
                  id="package_name"
                  value={formData.package_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, package_name: e.target.value }))}
                  placeholder="Enter package name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter package description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing</Label>
                <Input
                  id="pricing"
                  value={formData.pricing}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
                  placeholder="Enter pricing details"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Package Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/package-image.jpg"
                />
                <div className="text-xs text-muted-foreground">
                  Or upload to a service like Imgur, Cloudinary, or use a direct image URL
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPackage ? 'Update' : 'Create'}
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
        <div className="text-center py-8 text-muted-foreground">Loading packages...</div>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Package2 className="w-5 h-5" />
                      {pkg.package_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {pkg.service_category}
                      </Badge>
                      {(pkg as any).image_url && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Image className="w-3 h-3" />
                          <span>Has image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                <p className="font-semibold text-primary">{pkg.pricing}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}