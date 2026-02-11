-- ===========================================================================
-- SECTION 1: CLEANUP
-- ===========================================================================
-- Truncate removes all existing data from the interests table.
-- CASCADE ensures that references in related tables (like pulses) are handled.
TRUNCATE TABLE interests CASCADE;

-- ===========================================================================
-- SECTION 2: INTERESTS (The Global Vibe Catalog)
-- ===========================================================================
-- This table acts as a reference for all hobby/skill categories available.
-- Categories are grouped by "Vibes" to create a community feel.
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