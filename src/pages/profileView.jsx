// src/pages/ProfileView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import service from "../appwrite/appwriteDb";

export default function ProfileView() {
  const { id } = useParams(); // profile documentId from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const doc = await service.databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COLLECTION_ID,
          id
        );
        setProfile(doc);
      } catch (err) {
        console.error("ProfileView fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800">{profile.userName}</h1>
        <p className="text-gray-500 mb-4">
          {profile.email || "No email shown"}
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">About</h2>
          <p className="text-gray-600">{profile.bio || "No bio available"}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Skills Offered
          </h2>
          {profile.skills ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.split(",").map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No skills added.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Skills to Learn
          </h2>
          {profile.skillsNeeded ? (
            <div className="flex flex-wrap gap-2">
              {profile.skillsNeeded.split(",").map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No skills to learn added.</p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/explore")}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Back to Explore
        </button>
      </div>
    </div>
  );
}
