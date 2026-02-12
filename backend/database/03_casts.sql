-- SEED: Live and Past Casts with various streaming/meeting platforms
INSERT INTO casts (creator_id, skill_id, title, description, meeting_link, is_live) VALUES 
(
  (SELECT id FROM users WHERE username = 'brutal_builder'),
  (SELECT id FROM skills WHERE name = 'Neo-Brutalist UI'),
  'BRUTAL_UI_LIVE_WORKSHOP',
  'Building high-contrast interfaces with thick borders.',
  'https://twitch.tv/brutal_builder_live',
  true
),
(
  (SELECT id FROM users WHERE username = 'code_caster'),
  (SELECT id FROM skills WHERE name = 'Advanced PostgreSQL'),
  'DEEP_DIVE_INTO_INDEXING',
  'Making your queries lightning fast with proper indexing.',
  'https://discord.gg/skillcast-dev-hangout',
  true
),
(
  (SELECT id FROM users WHERE username = 'green_thumb'),
  (SELECT id FROM skills WHERE name = 'Urban Gardening'),
  'WINTER_PROOF_YOUR_BALCONY',
  'Keep your plants alive during the cold months.',
  'https://youtube.com/live/gardening-stream-ref',
  true
),
(
  (SELECT id FROM users WHERE username = 'chef_noir'),
  (SELECT id FROM skills WHERE name = 'Plant-Based Cooking'),
  'UMAMI_WITHOUT_MEAT',
  'Mastering plant-based broth and ferments.',
  'https://zoom.us/j/9998887776',
  false
),
(
  (SELECT id FROM users WHERE username = 'pixel_purist'),
  (SELECT id FROM skills WHERE name = 'Figma Workflow Pro'),
  'AUTO_LAYOUT_FOR_DEVS',
  'How to hand off Figma files that actually make sense.',
  'https://meet.google.com/xyz-pdqr-uvw',
  true
),
(
  (SELECT id FROM users WHERE username = 'sys_admin'),
  (SELECT id FROM skills WHERE name = 'Docker Containerization'),
  'CONTAINER_SECURITY_101',
  'Hardening your images for production environments.',
  'https://vimeo.com/event/123456789',
  true
);