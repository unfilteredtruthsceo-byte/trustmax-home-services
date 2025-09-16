-- Create services table
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  icon text NOT NULL,
  items text[] NOT NULL,
  description text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view services" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create services" 
ON public.services 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update services" 
ON public.services 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete services" 
ON public.services 
FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial services data
INSERT INTO public.services (title, icon, items, description) VALUES 
('🛠️ Plumbing Services', '🛠️', ARRAY['Tap / Shower / Mixer Installation & Repair', 'Pipeline Leakage Fix', 'Bathroom Setup (New Construction)', 'Water Tank Installation / Cleaning', 'Motor/Pump Installation', 'Geyser Installation'], 'Complete plumbing solutions for your home'),
('💡 Electrical Services', '💡', ARRAY['House Wiring (Full / Partial)', 'Switchboard Installation & Repair', 'Fan / Light / Chandelier Installation', 'Inverter Wiring Setup', 'Power Backup Wiring', 'Short Circuit Fix'], 'Safe and reliable electrical work'),
('🧱 Masonry & Civil Works', '🧱', ARRAY['Brick Wall Construction', 'Wall Repairs / Plastering', 'Compound Wall Construction', 'Floor Extension (add room/floor)', 'Cement Slab Work'], 'Strong foundation and construction work'),
('🏠 Tiles & Flooring', '🏠', ARRAY['Tile Laying (Bathroom / Kitchen / Full House)', 'Marble / Granite Work', 'Tile Replacements', 'Tile Polishing'], 'Beautiful flooring solutions'),
('🎨 Painting & Finishing', '🎨', ARRAY['Interior Wall Painting', 'Exterior Painting', 'Waterproof Coating', 'Wall Putty Work', 'Texture / Stencil Painting'], 'Transform your space with color'),
('🪚 Carpentry & Woodwork', '🪚', ARRAY['Door / Window Frame Installation', 'Door Designing & Polishing', 'Cupboard/Wardrobe Making', 'Modular Kitchen', 'Furniture Repair'], 'Custom woodwork and carpentry'),
('🔩 Fabrication & Metal Work', '🔩', ARRAY['Steel / MS / SS Railings', 'Grills & Gates', 'Shed / Roofing', 'Rolling Shutters'], 'Durable metal fabrication work'),
('🛋️ Interior & Aesthetic Work', '🛋️', ARRAY['False Ceiling', 'POP Design', 'Wall Partitions', 'Wallpaper / 3D Panel Installation', 'Lighting Design'], 'Interior design and aesthetics'),
('🌳 Plot & Outdoor Services', '🌳', ARRAY['Plot Cleaning (Manual / JCB)', 'Borewell Drilling & Repair', 'Landscaping & Gardening', 'Water Tank / Septic Tank Cleaning'], 'Outdoor and landscaping services'),
('👷 Worker Contracts', '👷', ARRAY['Mason Daily/Monthly Contract', 'Painter Contract', 'Carpenter Contract', 'General Labor Supply'], 'Skilled worker contracts'),
('🏗️ Complete Construction', '🏗️', ARRAY['Full House Construction (Turnkey)', 'Renovation (Kitchen/Bathroom/Full House)', 'Independent House Extension (Extra Floor)', 'Interior Design + Execution'], 'Complete construction solutions');