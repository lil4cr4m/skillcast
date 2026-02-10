-- ===========================================================================
-- SECTION: INTERESTS (The Global Vibe Catalog)
-- ===========================================================================
TRUNCATE TABLE interests CASCADE;

INSERT INTO interests (name, vibe_category) VALUES 
('Artisan Sourdough', 'Kitchen Alchemists'),
('React Performance', 'Code Poets'),
('Balcony Gardening', 'Garden Hackers'),
('Vinyasa Flow', 'Mindfulness Guides'),
('Street Photography', 'Urban Observers'),
('Stock Market Basics', 'Data Nerds'),
('Spanish Conversational', 'Global Connectors'),
('Ableton Live Setup', 'Sound Explorers')
ON CONFLICT (name) DO NOTHING;