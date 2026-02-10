import { query } from "../config/db.js";

/**
 * GET USER PROFILE & STATS
 * Aggregates Karma and activity counts for the Profile dashboard.
 */
export const getProfile = async (req, res) => {
  const { id } = req.params; // The ID of the user whose profile is being viewed
  try {
    const userStats = await query(
      `
        SELECT 
            u.id, u.username, u.name, u.bio, u.karma, u.role,
            (SELECT COUNT(*) FROM pulses WHERE creator_id = $1) as total_pulses,
            (SELECT COUNT(*) FROM gratitude_notes gn 
             JOIN pulses p ON gn.pulse_id = p.id 
             WHERE p.creator_id = $1) as notes_received
        FROM users u
        WHERE u.id = $1`,
      [id],
    );

    if (userStats.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json(userStats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

/**
 * GET LEADERBOARD
 * Fetches the top 10 users based on Karma (Requirement 1.6: Social Currency).
 */
export const getLeaderboard = async (req, res) => {
  try {
    const leaders = await query(
      "SELECT id, username, karma FROM users ORDER BY karma DESC LIMIT 10",
    );
    res.json(leaders.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
