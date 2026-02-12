import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import axios from "../../../shared/api/axios";
import Button from "../../../shared/ui/Button";
import { Trash2, Edit, Plus } from "lucide-react";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users/admin/all");
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      setDeletingUserId(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.error || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-offwhite">
        <div className="text-ink font-bold">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b-4 pb-6">
          <div>
            <h1 className="text-4xl font-black text-ink mb-2">
              ADMIN// USER MANAGEMENT
            </h1>
            <p className="text-sm font-mono text-ink">
              {users.length} users in database
            </p>
          </div>
          <Button
            variant="neon"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> CREATE USER
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-pink border-4 border-ink text-ink font-bold">
            ERROR: {error}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto border-4 border-ink bg-white shadow-brutal-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-ink text-offwhite border-b-4 border-ink">
                <th className="p-4 text-center font-black">USERNAME</th>
                <th className="p-4 text-center font-black">EMAIL</th>
                <th className="p-4 text-center font-black">ROLE</th>
                <th className="p-4 text-center font-black">CREDIT</th>
                <th className="p-4 text-center font-black">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b-2 border-ink hover:bg-neon-muted/10 transition"
                >
                  <td className="p-4 text-center">
                    <span className="font-bold text-ink">{u.username}</span>
                  </td>
                  <td className="p-4 text-sm text-center text-ink">
                    {u.email}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`font-bold px-3 py-1 border-2 border-ink ${
                        u.role === "admin"
                          ? "bg-pink text-offwhite"
                          : "bg-offwhite text-ink"
                      }`}
                    >
                      {u.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`font-bold ${u.credit >= 100 ? "text-yellow" : "text-ink"}`}
                    >
                      {u.credit}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-2 bg-danger border-2 border-ink hover:shadow-brutal transition"
                        title="Edit user"
                      >
                        <Edit size={16} className="text-white" />
                      </button>
                      {user.id !== u.id ? (
                        <button
                          onClick={() => setDeletingUserId(u.id)}
                          className="p-2 bg-danger border-2 border-ink hover:shadow-brutal transition"
                          title="Delete user"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="p-2 bg-ink/30 border-2 border-ink cursor-not-allowed opacity-60"
                          title="Cannot delete yourself"
                        >
                          <Trash2 size={16} className="text-gray-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deletingUserId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-offwhite border-4 border-ink p-8 shadow-brutal-xl max-w-md">
              <h2 className="text-2xl font-black text-ink mb-4">
                CONFIRM DELETION
              </h2>
              <p className="text-ink mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="cyan"
                  onClick={() => setDeletingUserId(null)}
                  className="flex-1"
                >
                  CANCEL
                </Button>
                <Button
                  variant="pink"
                  onClick={() => handleDeleteUser(deletingUserId)}
                  className="flex-1"
                >
                  DELETE
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={(updatedUser) => {
              setUsers(
                users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
              );
              setEditingUser(null);
            }}
          />
        )}

        {/* Create User Modal */}
        {isCreateModalOpen && (
          <CreateUserModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreateUser={(newUser) => {
              setUsers([newUser, ...users]);
              setIsCreateModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Edit User Modal Component
 */
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    credit: user.credit || 0,
    role: user.role || "member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "credit" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`/users/admin/${user.id}`, {
        name: formData.name,
        credit: formData.credit,
        role: formData.role,
      });
      onSave(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
      console.error("Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-offwhite border-4 border-ink p-8 shadow-brutal-xl max-w-md w-full">
        <h2 className="text-2xl font-black text-ink mb-6">EDIT USER</h2>

        {error && (
          <div className="mb-4 p-3 bg-pink border-2 border-ink text-ink text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-ink font-mono"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              EMAIL (Read Only)
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border-2 border-ink font-mono bg-offwhite/50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              CREDIT
            </label>
            <input
              type="number"
              name="credit"
              value={formData.credit}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-ink font-mono"
              placeholder="Credit amount"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              ROLE
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-ink font-mono font-bold"
            >
              <option value="member">MEMBER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="cyan" onClick={onClose} className="flex-1">
              CANCEL
            </Button>
            <Button
              variant="neon"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "SAVING..." : "SAVE"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Create User Modal Component
 */
function CreateUserModal({ onClose, onCreateUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    role: "member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      onCreateUser(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-offwhite border-4 border-ink p-8 shadow-brutal-xl max-w-md w-full">
        <h2 className="text-2xl font-black text-ink mb-6">CREATE USER</h2>

        {error && (
          <div className="mb-4 p-3 bg-pink border-2 border-ink text-ink text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              USERNAME
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-ink font-mono"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-ink font-mono"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-ink font-mono"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              NAME (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-ink font-mono"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-3">
              ROLE
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-ink font-mono font-bold"
            >
              <option value="member">MEMBER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="cyan" onClick={onClose} className="flex-1">
              CANCEL
            </Button>
            <Button
              variant="neon"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "CREATING..." : "CREATE"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
