-- Add enquiry_type column to distinguish different types of enquiries
ALTER TABLE public.enquiries ADD COLUMN enquiry_type TEXT NOT NULL DEFAULT 'general';

-- Add a comment to explain the enquiry types
COMMENT ON COLUMN public.enquiries.enquiry_type IS 'Types: general, package, interior_design, consultation';