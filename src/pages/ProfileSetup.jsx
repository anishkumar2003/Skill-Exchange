// src/pages/ProfileSetup.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/appwriteDb"; // your CRUD wrapper

export default function ProfileSetup() {
  const { userData } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    bio: "",
    skills: "",
    skillsToLearn: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch existing profile if it exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userData) return;

        const res = await service.getProfileDocument(userData.$id);
        if (res) {
          setForm({
            bio: res.bio || "",
            skills: res.skills || "",
            skillsToLearn: res.skillsNeeded || "", // ⚡ match your field naming
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // First check if profile exists
      const existingProfile = await service.getProfileDocument(userData.$id);
      console.log("Existing profile:", existingProfile);
      let response;
      if (existingProfile) {
        // ✅ Update existing profile
        response = await service.updateProfileDocument(existingProfile.$id, {
          bio: form.bio,
          skills: form.skills,
          skillsNeeded: form.skillsToLearn,
        });
      } else {
        // ✅ Create new profile
        response = await service.createProfileDocument(
          userData.$id,
          userData.name,
          form.bio,
          form.skills,
          form.skillsToLearn
        );
      }

      if (response) {
        navigate("/profile"); // redirect after saving
      } else {
        setError("Failed to save profile");
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Something went wrong while saving.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Loading profile setup...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          {form.bio || form.skills || form.skillsToLearn
            ? "Update Your Profile"
            : "Setup Your Profile"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills you have
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Skills to Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills you want to learn
            </label>
            <input
              type="text"
              name="skillsToLearn"
              value={form.skillsToLearn}
              onChange={handleChange}
              placeholder="e.g. Machine Learning, Rust"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
