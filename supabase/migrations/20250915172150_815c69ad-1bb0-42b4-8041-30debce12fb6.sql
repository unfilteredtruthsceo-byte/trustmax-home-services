-- Create enquiries table
CREATE TABLE public.enquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    location TEXT NOT NULL,
    service_type TEXT NOT NULL,
    description TEXT NOT NULL,
    budget TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed', 'cancelled')),
    assigned_worker TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_category TEXT NOT NULL,
    package_name TEXT NOT NULL,
    description TEXT NOT NULL,
    pricing TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies for enquiries (public can insert, admin can view all)
CREATE POLICY "Anyone can create enquiries" 
ON public.enquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view enquiries" 
ON public.enquiries 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update enquiries" 
ON public.enquiries 
FOR UPDATE 
USING (true);

-- Create policies for packages (public can read, admin can modify)
CREATE POLICY "Anyone can view packages" 
ON public.packages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create packages" 
ON public.packages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update packages" 
ON public.packages 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete packages" 
ON public.packages 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_enquiries_updated_at
    BEFORE UPDATE ON public.enquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON public.packages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial packages data
INSERT INTO public.packages (service_category, package_name, description, pricing) VALUES
-- Plumbing Packages
('Plumbing', '🛠️ Basic Repair', 'Leakage Fix, Tap Replacement (up to 2 taps)', '₹500 – ₹700'),
('Plumbing', '🚿 Bathroom Setup', 'Complete bathroom plumbing + fixtures', '₹5,000 – ₹15,000'),
('Plumbing', '🏠 Full House Plumbing', '1BHK / 2BHK / 3BHK', 'Per house fixed price'),

-- Electrical Packages
('Electrical', '💡 Basic Electrical Repair', 'Switchboard / Socket Fix', '₹300 – ₹500'),
('Electrical', '🔌 Wiring Package', 'Full Wiring for 1BHK/2BHK/3BHK', 'Per sqft or per house'),
('Electrical', '⚡ Power Backup Setup', 'Inverter + UPS Wiring', 'Fixed price'),

-- Tiles & Flooring Packages
('Tiles & Flooring', '🧱 Tile Laying Package', 'Per sqft cost (labour only)', '₹40–₹80/sqft'),
('Tiles & Flooring', '✨ Premium Flooring', 'Marble/Granite Work', 'Custom quote'),

-- Painting Packages
('Painting', '🎨 Basic Repaint', 'Single color interior walls', '₹8–₹12/sqft'),
('Painting', '🏡 Exterior Paint', 'Waterproof coat + exterior finish', 'Per sqft'),
('Painting', '🖌️ Texture Package', 'Accent walls, designer paint', 'Custom quote'),

-- Carpentry Packages
('Carpentry', '🚪 Door Installation', 'Frame + Door Fixing', '₹1,500 – ₹3,000'),
('Carpentry', '🍽️ Modular Kitchen', 'Per sqft price', '₹1,500 – ₹2,500/sqft'),
('Carpentry', '🪑 Furniture Repair', 'Tables, chairs, beds', 'Per job basis'),

-- Plot Services Packages
('Plot Services', '🌱 Small Plot Cleaning', '< 200 sq yards', '₹3,000 – ₹6,000'),
('Plot Services', '🏞️ Large Plot Cleaning', '200–500 sq yards', '₹6,000+ (JCB extra)'),
('Plot Services', '🚜 JCB Hire', 'Per hour', '₹1,200 – ₹1,800/hr'),

-- AMC Packages
('AMC', 'Plan A', '3 Visits/Year (Plumber + Electrician)', '₹2,500'),
('AMC', 'Plan B', '6 Visits/Year + Priority Calls', '₹4,500'),
('AMC', 'Plan C', 'Unlimited Calls (Labor Only)', '₹7,500');