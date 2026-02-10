-- ===========================================================================
-- SECTION: PULSES & GRATITUDE (Live Content)
-- ===========================================================================
TRUNCATE TABLE pulses CASCADE;
TRUNCATE TABLE gratitude_notes CASCADE;

-- CREATE ACTIVE SIGNALS
INSERT INTO pulses (creator_id, interest_id, title, description, meeting_link, is_live) VALUES 
(
    (SELECT id FROM users WHERE username='sourdough_sam'), 
    (SELECT id FROM interests WHERE name='Artisan Sourdough'), 
    'Scoring & Baking LIVE', 
    'Join me as I score my loaves!', 
    'https://meet.jit.si/passionpulse-bread', 
    true
),
(
    (SELECT id FROM users WHERE username='code_clara'), 
    (SELECT id FROM interests WHERE name='React Performance'), 
    'Debugging UseMemo', 
    'Feel free to hop in and ask React questions.', 
    'https://zoom.us/j/pulse-code', 
    true
);

-- CREATE INITIAL SOCIAL PROOF
-- Note: This will trigger the award_karma() function in the schema!
INSERT INTO gratitude_notes (pulse_id, sender_id, content) VALUES 
(
    (SELECT id FROM pulses WHERE title='Scoring & Baking LIVE'),
    (SELECT id FROM users WHERE username='yoga_yuna'),
    'The way you explained scoring depth was so helpful!'
);