-- Create tiles table
CREATE TABLE IF NOT EXISTS public.tiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_number INTEGER NOT NULL,
  tile_position INTEGER NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT,
  image_url TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  license_key_used UUID REFERENCES public.license_keys(id),
  UNIQUE(page_number, tile_position)
);

-- Enable RLS
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;

-- Create policies for tiles
CREATE POLICY "Anyone can view tiles" ON public.tiles 
  FOR SELECT USING (true);

CREATE POLICY "Only tile owners can update their tiles" ON public.tiles 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can claim tiles" ON public.tiles 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
