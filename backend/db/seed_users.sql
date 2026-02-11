-- ===========================================================================
-- SECTION 1: CLEANUP
-- ===========================================================================
-- Remove existing user data and all associated child records.
TRUNCATE TABLE users CASCADE;

-- ===========================================================================
-- SECTION 2: USERS
-- All passwords are set to 'password123' (hashed via bcrypt)
-- ===========================================================================
-- Initial community members with varying roles and Karma scores.
-- Admin has high karma and administrative privileges (Requirement 1.3).
INSERT INTO users (username, email, password_hash, name, bio, role, karma) VALUES 
('vibe_admin', 'admin@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'System Mod', 'Keeping the pulse healthy.', 'admin', 999),
('sourdough_sam', 'sam@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Sam Baker', 'Obsessed with wild yeast and hydration percentages.', 'member', 50),
('code_clara', 'clara@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Clara Dev', 'React enthusiast and clean code advocate.', 'member', 120),
('plant_paul', 'paul@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Paul Green', 'Turning my balcony into a jungle, one cutting at a time.', 'member', 30),
('yoga_yuna', 'yuna@pulse.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4S3H972SGy', 'Yuna Kim', 'Vinyasa flow and mindfulness for busy developers.', 'member', 85)
ON CONFLICT (email) DO NOTHING;

-- ===========================================================================
-- SECTION 3: USER PERSISTENT VIBES (Many-to-Many)
-- ===========================================================================
-- Linking users to their persistent interests/specialties for profile display.
INSERT INTO user_interests (user_id, interest_id) VALUES 
((SELECT id FROM users WHERE username='sourdough_sam'), (SELECT id FROM interests WHERE name='Artisan Sourdough')),
((SELECT id FROM users WHERE username='code_clara'), (SELECT id FROM interests WHERE name='React Performance')),
((SELECT id FROM users WHERE username='code_clara'), (SELECT id FROM interests WHERE name='Spanish Conversational')),
((SELECT id FROM users WHERE username='yoga_yuna'), (SELECT id FROM interests WHERE name='Vinyasa Flow'));

-- ===========================================================================
-- SECTION 4: LIVE PULSES (The "Signal" Feed)
-- ===========================================================================
-- These represent active or upcoming skill-sharing sessions with meeting links.
INSERT INTO pulses (creator_id, interest_id, title, description, meeting_link, is_live) VALUES 
(
    (SELECT id FROM users WHERE username='sourdough_sam'), 
    (SELECT id FROM interests WHERE name='Artisan Sourdough'), 
    'Scoring & Baking LIVE', 
    'Join me as I score my loaves and talk about steam in the oven!', 
    'https://meet.jit.si/passionpulse-bread', 
    true
),
(
    (SELECT id FROM users WHERE username='code_clara'), 
    (SELECT id FROM interests WHERE name='React Performance'), 
    'Debugging UseMemo', 
    'Just working on a project, feel free to hop in and ask React questions.', 
    'https://zoom.us/j/pulse-code', 
    true
);

-- ===========================================================================
-- SECTION 5: GRATITUDE NOTES (Community Social Proof)
-- ===========================================================================
-- Feedback left by users who attended a session, which increments user Karma.
INSERT INTO gratitude_notes (pulse_id, sender_id, content) VALUES 
(
    (SELECT id FROM pulses WHERE title='Scoring & Baking LIVE'),
    (SELECT id FROM users WHERE username='plant_paul'),
    'The way you explained scoring depth was so helpful! My loaves look great now.'
);