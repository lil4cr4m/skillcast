-- ===========================================================================
-- 1. EXTENSIONS & CONFIG
-- ===========================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
ALTER DATABASE passion_pulse_db SET timezone TO 'Asia/Singapore';

-- ===========================================================================
-- 2. CLEANUP
-- ===========================================================================
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS gratitude_notes CASCADE;
DROP TABLE IF EXISTS pulses CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================================================
-- 3. TABLES
-- ===========================================================================

-- USERS: Profiles and social currency (Karma)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL CHECK (char_length(username) >= 3),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100),
    bio TEXT,
    karma INT DEFAULT 0, -- Social currency awarded for help
    role VARCHAR(10) DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REFRESH TOKENS: For secure, long-lived sessions
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INTERESTS: The global vibe catalog
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    vibe_category VARCHAR(50) NOT NULL
);

-- USER_INTERESTS: Many-to-Many mapping for profile vibes
CREATE TABLE user_interests (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- PULSES: The "Live Now" signals
CREATE TABLE pulses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    meeting_link TEXT NOT NULL,
    is_live BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GRATITUDE_NOTES: Social proof and peer feedback
CREATE TABLE gratitude_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_id UUID REFERENCES pulses(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================================================
-- 4. AUTOMATION (TRIGGERS)
-- ===========================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_update_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_update_pulses BEFORE UPDATE ON pulses FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Karma Reward Logic: Give +10 Karma to creators when a note is received
CREATE OR REPLACE FUNCTION award_karma() RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET karma = karma + 10 
    WHERE id = (SELECT creator_id FROM pulses WHERE id = NEW.pulse_id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_award_karma AFTER INSERT ON gratitude_notes FOR EACH ROW EXECUTE FUNCTION award_karma();