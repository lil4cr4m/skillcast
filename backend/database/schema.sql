-- ===========================================================================
-- 1. CONFIG
-- ===========================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
ALTER DATABASE skillcast_db SET timezone TO 'Asia/Singapore';

-- ===========================================================================
-- 2. CLEANUP
-- ===========================================================================
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS casts CASCADE; -- Renamed from pulses
DROP TABLE IF EXISTS user_skills CASCADE; -- Renamed from user_interests
DROP TABLE IF EXISTS skills CASCADE; -- Renamed from interests
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================================================
-- 3. TABLES
-- ===========================================================================

-- USERS: Profiles and Credit (Social Currency)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL CHECK (char_length(username) >= 3),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100),
    bio TEXT,
    credit INT DEFAULT 0, -- Replaced Karma/Trust with 'Credit'
    role VARCHAR(10) DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKILLS: The catalog of subjects (e.g., 'React', 'Cooking')
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL 
);

-- CASTS: The "Live Now" broadcasting sessions
-- Status workflow: LIVE (active, default) → PAUSED (hidden) → ENDED (inactive) → ARCHIVED (soft deleted)
CREATE TABLE casts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    meeting_link TEXT NOT NULL,
    status VARCHAR(10) DEFAULT 'LIVE' CHECK (status IN ('LIVE', 'PAUSED', 'ENDED', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REFRESH TOKENS: Session persistence and revocation
CREATE TABLE refresh_tokens (
    token TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTES: Peer feedback/Thank you notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cast_id UUID REFERENCES casts(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================================================
-- 4. AUTOMATION
-- ===========================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_update_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER tr_update_casts BEFORE UPDATE ON casts FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- Credit Reward Logic: +10 Credit when a Cast receives a note
CREATE OR REPLACE FUNCTION award_credit() RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET credit = credit + 10 
    WHERE id = (SELECT creator_id FROM casts WHERE id = NEW.cast_id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_award_credit AFTER INSERT ON notes FOR EACH ROW EXECUTE FUNCTION award_credit();
