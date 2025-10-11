import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnquiries } from '@/hooks/useEnquiries';
import { usePackages } from '@/hooks/usePackages';
import { PackageManagement } from '@/components/PackageManagement';
import { ServiceManagement } from '@/components/ServiceManagement';
import { ProductManagement } from '@/components/ProductManagement';
import { useServices } from '@/hooks/useServices';
import { useProducts } from '@/hooks/useProducts';
import { ImageUpload } from '@/components/ImageUpload';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Users, Clock, CheckCircle, Phone, MapPin, Calendar, Filter, LogOut, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function Admin() {
  const { enquiries, updateEnquiry, loading: enquiriesLoading } = useEnquiries();
  const { packages, loading: packagesLoading, refetch: refetchPackages } = usePackages();
  const { services, loading: servicesLoading, refetch: refetchServices } = useServices();
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { signOut } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "Successfully logged out",
        });
        navigate('/admin-login');
      }
    } catch (error) {
      toast({
        title: "Logout Failed", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    if (filterStatus !== 'all' && enquiry.status !== filterStatus) return false;
    if (filterService !== 'all' && enquiry.service_type !== filterService) return false;
    return true;
  });

  const statusCounts = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    assigned: enquiries.filter(e => e.status === 'assigned').length,
    completed: enquiries.filter(e => e.status === 'completed').length,
  };

  const uniqueServices = [...new Set(enquiries.map(e => e.service_type))];

  const handleStatusUpdate = async (enquiryId: string, newStatus: string, assignedWorker?: string) => {
    await updateEnquiry(enquiryId, { 
      status: newStatus as any,
      ...(assignedWorker && { assigned_worker: assignedWorker })
    });
  };

  const handleImageUploaded = (url: string) => {
    console.log(`New image uploaded:`, url);
    // Refresh packages, services, and products to show new images
    refetchPackages();
    refetchServices();
    refetchProducts();
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Tivup Admin Panel</h1>
                <p className="text-muted-foreground">Manage enquiries, packages and services</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Enquiries</p>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned</p>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.assigned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          <Tabs defaultValue="enquiries" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="images">Image Gallery</TabsTrigger>
            </TabsList>

          <TabsContent value="enquiries" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterService} onValueChange={setFilterService}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder="Filter by service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {uniqueServices.map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Enquiries List */}
            <div className="grid gap-6">
              {enquiriesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading enquiries...</div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No enquiries found.</div>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <Card key={enquiry.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{enquiry.name}</CardTitle>
                            <Badge 
                              variant="outline" 
                              className={
                                enquiry.enquiry_type === 'package' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                enquiry.enquiry_type === 'interior_design' ? 'bg-pink-100 text-pink-800 border-pink-300' :
                                enquiry.enquiry_type === 'consultation' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              }
                            >
                              {enquiry.enquiry_type === 'package' ? '📦 Package' :
                               enquiry.enquiry_type === 'interior_design' ? '🎨 Interior Design' :
                               enquiry.enquiry_type === 'consultation' ? '💬 Consultation' :
                               '📝 General'}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(enquiry.created_at), 'PPp')}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(enquiry.status)}>
                          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{enquiry.phone}</span>
                          </div>
                          {enquiry.email && (
                            <div className="text-sm text-muted-foreground">
                              Email: {enquiry.email}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{enquiry.location}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Service: </span>
                            <span className="text-sm">{enquiry.service_type}</span>
                            {enquiry.enquiry_type === 'package' && (
                              <div className="mt-1">
                                <span className="text-xs text-purple-600 font-medium">
                                  📦 Customer enquired for a specific package
                                </span>
                              </div>
                            )}
                          </div>
                          {enquiry.budget && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Budget: </span>
                              <span className="text-sm">{enquiry.budget}</span>
                            </div>
                          )}
                          {enquiry.assigned_worker && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Assigned to: </span>
                              <span className="text-sm">{enquiry.assigned_worker}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Description:</p>
                        <p className="text-sm">{enquiry.description}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Select 
                          value={enquiry.status} 
                          onValueChange={(value) => handleStatusUpdate(enquiry.id, value)}
                        >
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input 
                          placeholder="Assign worker..."
                          defaultValue={enquiry.assigned_worker || ''}
                          onBlur={(e) => {
                            if (e.target.value !== (enquiry.assigned_worker || '')) {
                              handleStatusUpdate(enquiry.id, enquiry.status, e.target.value);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

            <TabsContent value="packages" className="space-y-6">
              <PackageManagement />
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <ServiceManagement />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <div className="space-y-6">
                <ImageUpload onImageUploaded={handleImageUploaded} />
                
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Image Gallery</CardTitle>
                        <CardDescription>
                          View and manage uploaded images from packages, services, and products
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          refetchPackages();
                          refetchServices();
                          refetchProducts();
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Package Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {packages.filter(pkg => (pkg as any).image_url).map((pkg) => (
                        <div key={pkg.id} className="space-y-2">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={(pkg as any).image_url} 
                              alt={pkg.package_name}
                              className="w-full h-full object-cover hover:scale-105 transition-smooth cursor-pointer"
                              onClick={() => window.open((pkg as any).image_url, '_blank')}
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{pkg.package_name}</p>
                            <p className="text-xs text-muted-foreground">{pkg.service_category}</p>
                          </div>
                        </div>
                      ))}
                      {packages.filter(pkg => (pkg as any).image_url).length === 0 && (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          No package images uploaded yet
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Service Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.filter(service => service.image_url).map((service) => (
                        <div key={service.id} className="space-y-2">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={service.image_url!} 
                              alt={service.title}
                              className="w-full h-full object-cover hover:scale-105 transition-smooth cursor-pointer"
                              onClick={() => window.open(service.image_url!, '_blank')}
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{service.title}</p>
                          </div>
                        </div>
                      ))}
                      {services.filter(service => service.image_url).length === 0 && (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          No service images uploaded yet
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Product Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.filter(product => product.image_url).map((product) => (
                        <div key={product.id} className="space-y-2">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={product.image_url!} 
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-smooth cursor-pointer"
                              onClick={() => window.open(product.image_url!, '_blank')}
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                      ))}
                      {products.filter(product => product.image_url).length === 0 && (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          No product images uploaded yet
                        </div>
                      )}
                    </div>
                  </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">How to Use Uploaded Images</h4>
                      <div className="text-sm text-green-800 space-y-1">
                        <p>• Images uploaded here are stored in Supabase Storage</p>
                        <p>• Copy the image URL from the gallery above</p>
                        <p>• Paste the URL in package, service, or product forms when editing</p>
                        <p>• Images are automatically optimized and served via CDN</p>
                        <p>• Recommended size: 800x450px (16:9 aspect ratio) for best results</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}