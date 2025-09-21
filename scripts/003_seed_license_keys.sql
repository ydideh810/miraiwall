-- Insert some sample license keys for testing
INSERT INTO public.license_keys (license_key) VALUES 
  ('MIRAI-2024-ALPHA-001'),
  ('MIRAI-2024-ALPHA-002'),
  ('MIRAI-2024-ALPHA-003'),
  ('MIRAI-2024-BETA-001'),
  ('MIRAI-2024-BETA-002'),
  ('CYBER-GRID-PREMIUM-001'),
  ('CYBER-GRID-PREMIUM-002'),
  ('NEON-TILE-SPECIAL-001'),
  ('RETRO-FUTURE-VIP-001'),
  ('DIGITAL-SPACE-PRO-001')
ON CONFLICT (license_key) DO NOTHING;
