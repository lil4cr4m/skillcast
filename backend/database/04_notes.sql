-- SEED: Notes/Feedback
-- Sample notes sent by users for various casts
INSERT INTO notes (cast_id, sender_id, content) VALUES
(
  (SELECT id FROM casts WHERE title = 'BRUTAL_UI_LIVE_WORKSHOP' LIMIT 1),
  (SELECT id FROM users WHERE username = 'code_caster'),
  'Absolutely loved the high-contrast design principles shown in this session. Different perspective changed how I think about UI.'
),
(
  (SELECT id FROM casts WHERE title = 'BRUTAL_UI_LIVE_WORKSHOP' LIMIT 1),
  (SELECT id FROM users WHERE username = 'film_fanatic'),
  'The explanation of border thickness ratios was incredibly clear. Applying this to my next project for sure.'
),
(
  (SELECT id FROM casts WHERE title = 'DEEP_DIVE_INTO_INDEXING' LIMIT 1),
  (SELECT id FROM users WHERE username = 'brutal_builder'),
  'Your PostgreSQL indexing strategies just saved me hours of query optimization. This is gold.'
),
(
  (SELECT id FROM casts WHERE title = 'DEEP_DIVE_INTO_INDEXING' LIMIT 1),
  (SELECT id FROM users WHERE username = 'green_thumb'),
  'Finally understand how B-tree indexes actually work. Great explanations with real examples!'
),
(
  (SELECT id FROM casts WHERE title = 'WINTER_PROOF_YOUR_BALCONY' LIMIT 1),
  (SELECT id FROM users WHERE username = 'brutal_builder'),
  'My monstera survived winter thanks to your watering tips. Never thought I could keep plants alive in cold seasons.'
),
(
  (SELECT id FROM casts WHERE title = 'AUTO_LAYOUT_FOR_DEVS' LIMIT 1),
  (SELECT id FROM users WHERE username = 'code_caster'),
  'Hand-offs between design and dev just became so much smoother. Everyone on the team watched this session.'
),
(
  (SELECT id FROM casts WHERE title = 'CONTAINER_SECURITY_101' LIMIT 1),
  (SELECT id FROM users WHERE username = 'brutal_builder'),
  'Security vulnerabilities in our CI/CD pipeline fixed after this session. Best knowledge share we''ve had.'
);
