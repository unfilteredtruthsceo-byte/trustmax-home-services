import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationInputProps {
  value: string;
  onChange: (location: string) => void;
  required?: boolean;
}

interface LocationDetails {
  houseNumber: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

export function LocationInput({ value, onChange, required = false }: LocationInputProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    houseNumber: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const { toast } = useToast();

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location detection",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Using a free reverse geocoding service
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&language=en&pretty=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const components = result.components;
              
              const detectedLocation = `${components.house_number || ''} ${components.road || ''}, ${components.suburb || components.neighbourhood || ''}, ${components.city || components.town || ''}, ${components.state || ''} - ${components.postcode || ''}`.replace(/\s+/g, ' ').trim();
              
              onChange(detectedLocation);
              
              // Update detailed fields
              setLocationDetails({
                houseNumber: components.house_number || '',
                street: components.road || '',
                area: components.suburb || components.neighbourhood || '',
                city: components.city || components.town || '',
                state: components.state || '',
                pincode: components.postcode || '',
                landmark: ''
              });
              
              toast({
                title: "Location detected",
                description: "Your current location has been detected successfully",
              });
            } else {
              // Fallback: just show coordinates
              onChange(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
            }
          } else {
            // Fallback: just show coordinates
            onChange(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
          }
        } catch (error) {
          // Fallback: just show coordinates
          const { latitude, longitude } = position.coords;
          onChange(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
          
          toast({
            title: "Location detected",
            description: "Location coordinates have been detected",
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        toast({
          title: "Location detection failed",
          description: "Please enter your location manually",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const updateLocationFromDetails = () => {
    const location = [
      locationDetails.houseNumber,
      locationDetails.street,
      locationDetails.area,
      locationDetails.city,
      locationDetails.state,
      locationDetails.pincode
    ].filter(Boolean).join(', ');
    
    const fullLocation = locationDetails.landmark 
      ? `${location} (Near: ${locationDetails.landmark})`
      : location;
      
    onChange(fullLocation);
  };

  const handleDetailChange = (field: keyof LocationDetails, value: string) => {
    setLocationDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">
          Complete Address {required && '*'}
        </Label>
        <div className="flex gap-2">
          <Input
            id="location"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder="Enter your complete address"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={detectLocation}
            disabled={isDetecting}
            className="shrink-0"
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowDetailed(!showDetailed)}
        >
          {showDetailed ? 'Simple View' : 'Detailed Address'}
        </Button>
      </div>

      {showDetailed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
          <div className="space-y-2">
            <Label htmlFor="house-number">House/Building Number</Label>
            <Input
              id="house-number"
              value={locationDetails.houseNumber}
              onChange={(e) => handleDetailChange('houseNumber', e.target.value)}
              placeholder="e.g., 123, A-45"
              onBlur={updateLocationFromDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street/Road Name</Label>
            <Input
              id="street"
              value={locationDetails.street}
              onChange={(e) => handleDetailChange('street', e.target.value)}
              placeholder="e.g., MG Road, Park Street"
              onBlur={updateLocationFromDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area/Locality</Label>
            <Input
              id="area"
              value={locationDetails.area}
              onChange={(e) => handleDetailChange('area', e.target.value)}
              placeholder="e.g., Koramangala, Banjara Hills"
              onBlur={updateLocationFromDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={locationDetails.city}
              onChange={(e) => handleDetailChange('city', e.target.value)}
              placeholder="e.g., Bangalore, Hyderabad"
              onBlur={updateLocationFromDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={locationDetails.state}
              onChange={(e) => handleDetailChange('state', e.target.value)}
              placeholder="e.g., Karnataka, Telangana"
              onBlur={updateLocationFromDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input
              id="pincode"
              value={locationDetails.pincode}
              onChange={(e) => handleDetailChange('pincode', e.target.value)}
              placeholder="e.g., 560034, 500032"
              onBlur={updateLocationFromDetails}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="landmark">Nearby Landmark (Optional)</Label>
            <Input
              id="landmark"
              value={locationDetails.landmark}
              onChange={(e) => handleDetailChange('landmark', e.target.value)}
              placeholder="e.g., Near Metro Station, Behind Mall"
              onBlur={updateLocationFromDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
}