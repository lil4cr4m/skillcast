-- ===========================================================================
-- SECTION: USERS (Initial Community)
-- ===========================================================================
TRUNCATE TABLE users CASCADE;

INSERT INTO users (username, email, password_hash, name, bio, role, karma) VALUES 
('vibe_admin', 'admin@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'System Mod', 'Keeping the pulse healthy.', 'admin', 999),
('sourdough_sam', 'sam@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Sam Baker', 'Obsessed with wild yeast.', 'member', 50),
('code_clara', 'clara@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Clara Dev', 'React enthusiast.', 'member', 120),
('yoga_yuna', 'yuna@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Yuna Kim', 'Mindfulness for devs.', 'member', 85)
ON CONFLICT (email) DO NOTHING;

-- LINK USERS TO THEIR PERMANENT INTERESTS
INSERT INTO user_interests (user_id, interest_id) VALUES 
((SELECT id FROM users WHERE username='sourdough_sam'), (SELECT id FROM interests WHERE name='Artisan Sourdough')),
((SELECT id FROM users WHERE username='code_clara'), (SELECT id FROM interests WHERE name='React Performance')),
((SELECT id FROM users WHERE username='yoga_yuna'), (SELECT id FROM interests WHERE name='Vinyasa Flow'));