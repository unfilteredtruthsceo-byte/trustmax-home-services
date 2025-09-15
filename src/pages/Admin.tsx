import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnquiries } from '@/hooks/useEnquiries';
import { usePackages } from '@/hooks/usePackages';
import { BarChart, Users, Clock, CheckCircle, Phone, MapPin, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';

export function Admin() {
  const { enquiries, updateEnquiry, loading: enquiriesLoading } = useEnquiries();
  const { packages, loading: packagesLoading } = usePackages();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">TrustMax Admin Panel</h1>
          <p className="text-muted-foreground">Manage enquiries and packages</p>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enquiries">Enquiries Management</TabsTrigger>
            <TabsTrigger value="packages">Packages Management</TabsTrigger>
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
                          <CardTitle className="text-lg">{enquiry.name}</CardTitle>
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
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Packages Overview</CardTitle>
                <CardDescription>
                  Manage service packages and pricing. Total packages: {packages.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {packagesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading packages...</div>
                ) : (
                  <div className="grid gap-4">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{pkg.package_name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                            <p className="text-sm font-medium text-primary mt-2">{pkg.pricing}</p>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {pkg.service_category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}