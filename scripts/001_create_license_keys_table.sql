-- Create license_keys table
CREATE TABLE IF NOT EXISTS public.license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT UNIQUE NOT NULL,
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for license_keys
CREATE POLICY "Anyone can check license key validity" ON public.license_keys 
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can redeem" ON public.license_keys 
  FOR UPDATE USING (auth.uid() IS NOT NULL);
