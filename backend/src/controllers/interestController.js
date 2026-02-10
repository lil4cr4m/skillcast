import { query } from "../config/db.js";

/**
 * GET ALL INTERESTS
 * Returns the global vibe catalog (Requirement 1.5)
 */
export const getAllInterests = async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM interests ORDER BY vibe_category, name ASC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vibe catalog" });
  }
};

/**
 * ADD USER INTEREST
 * Pins a vibe to the user's persistent profile (Requirement 1.7)
 */
export const addUserInterest = async (req, res) => {
  const { interestId } = req.body;
  if (!interestId)
    return res.status(400).json({ error: "No Interest ID provided" });

  try {
    // Use user ID from JWT (req.user.id)
    await query(
      "INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.user.id, interestId],
    );
    res.status(201).json({ message: "Vibe pinned to profile" });
  } catch (err) {
    res.status(500).json({ error: "Could not update profile interests" });
  }
};
