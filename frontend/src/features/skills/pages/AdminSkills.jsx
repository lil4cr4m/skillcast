import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import axios from "../../../shared/api/axios";
import Button from "../../../shared/ui/Button";
import { Trash2, Edit, Plus } from "lucide-react";

export default function AdminSkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkillId, setDeletingSkillId] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "" });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  // Fetch all skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/skills");
        setSkills(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch skills");
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchSkills();
    }
  }, [user]);

  const handleOpenCreateModal = () => {
    setFormData({ name: "", category: "" });
    setEditingSkill(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setFormData({ name: skill.name, category: skill.category });
    setEditingSkill(skill);
    setIsCreateModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      setError("Name and category are required");
      return;
    }

    try {
      if (editingSkill) {
        // Update existing skill
        const response = await axios.put(
          `/skills/${editingSkill.id}`,
          formData,
        );
        setSkills(
          skills.map((s) => (s.id === editingSkill.id ? response.data : s)),
        );
        setEditingSkill(null);
      } else {
        // Create new skill
        const response = await axios.post("/skills", formData);
        setSkills([...skills, response.data]);
      }
      setIsCreateModalOpen(false);
      setFormData({ name: "", category: "" });
      setError(null);
    } catch (err) {
      console.error("Error saving skill:", err);
      setError(err.response?.data?.error || "Failed to save skill");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(`/skills/${skillId}`);
      setSkills(skills.filter((s) => s.id !== skillId));
      setDeletingSkillId(null);
      setError(null);
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError(err.response?.data?.error || "Failed to delete skill");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-offwhite">
        <div className="text-ink font-bold">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-ink mb-2">
              ADMIN_SKILL_MANAGEMENT
            </h1>
            <p className="text-sm font-mono text-ink">
              {skills.length} SKILLS_IN_DATABASE
            </p>
          </div>
          <Button
            variant="neon"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> CREATE_SKILL
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-pink border-4 border-ink text-ink font-bold">
            ERROR: {error}
          </div>
        )}

        {/* Skills Table */}
        <div className="overflow-x-auto border-4 border-ink bg-white shadow-brutal-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-ink text-offwhite border-b-4 border-ink">
                <th className="p-4 text-center font-black">NAME</th>
                <th className="p-4 text-center font-black">CATEGORY</th>
                <th className="p-4 text-center font-black">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr
                  key={skill.id}
                  className="border-b-2 border-ink hover:bg-neon-muted/10 transition"
                >
                  <td className="p-4 text-center">
                    <span className="font-bold text-ink">{skill.name}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold px-3 py-1 border-2 border-ink bg-yellow text-white">
                      {skill.category}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(skill)}
                        className="p-2 bg-violet border-2 border-ink hover:shadow-brutal transition text-white"
                        title="Edit skill"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingSkillId(skill.id)}
                        className="p-2 bg-danger border-2 border-ink hover:shadow-brutal transition text-white"
                        title="Delete skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Skill Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-offwhite border-4 border-ink p-8 shadow-brutal-xl max-w-md w-full">
              <h2 className="text-2xl font-black text-ink mb-6">
                {editingSkill ? "Edit skill" : "Create new skill"}
              </h2>

              <form onSubmit={handleSaveSkill} className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., React Hooks"
                    className="input-brutal w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., TECHNOLOGY"
                    className="input-brutal w-full"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="cyan"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="pink" className="flex-1">
                    {editingSkill ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingSkillId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-offwhite border-4 border-ink p-8 shadow-brutal-xl max-w-md">
              <h2 className="text-2xl font-black text-ink mb-4">
                Delete skill?
              </h2>
              <p className="text-ink mb-6">This action cannot be undone.</p>
              <div className="flex gap-4">
                <Button
                  variant="cyan"
                  onClick={() => setDeletingSkillId(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="pink"
                  onClick={() => handleDeleteSkill(deletingSkillId)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
