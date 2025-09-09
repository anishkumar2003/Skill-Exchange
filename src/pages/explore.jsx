// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import service from "../appwrite/appwriteDb";
import { useNavigate, Link } from "react-router-dom";

export default function Explore() {
  const { userData } = useSelector((state) => state.auth);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      setLoading(false); // stop loader if not logged in
      return;
    }

    const fetchProfiles = async () => {
      try {
        const res = await service.getAllProfiles();
        setProfiles(res);
      } catch (err) {
        console.error("Explore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userData]);

  // 👉 Case: Not logged in
  if (!userData) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-50 px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please login to explore profiles
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to see and connect with other members.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Loading profiles...
      </div>
    );
  }

  const filteredProfiles = profiles.filter((p) =>
    search
      ? p.skills?.toLowerCase().includes(search.toLowerCase()) ||
        p.skillsToLearn?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Explore Profiles
        </h1>

        {/* Search Bar */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            placeholder="Search by skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Profiles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.$id}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700">
                  {profile.userName?.[0] || "U"}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {profile.userName || "Anonymous"}
                  </h2>
                  <p className="text-sm text-gray-500">{profile.email || ""}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {profile.bio || "No bio provided."}
              </p>

              {/* Skills */}
              {profile.skills && (
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Skills Offered:
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.skills.split(",").map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to Learn */}
              {profile.skillsToLearn && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Wants to Learn:
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.skillsToLearn.split(",").map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/profile/${profile.$id}`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Visit Profile
                </button>
                <button
                  onClick={() => alert("Connection request sent! 🚀")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No profiles match your search.
          </p>
        )}
      </div>
    </div>
  );
}
