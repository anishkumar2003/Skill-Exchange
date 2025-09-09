// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import service from "../appwrite/appwriteDb";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const fetchProfile = async () => {
      try {
        const res = await service.getProfileDocument(userData.$id);
        if (res) {
          setProfile(res);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Loading profile...
      </div>
    );
  }

  // 👉 Empty state if profile not found
  if (!profile) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven’t set up your profile yet. Click below to create your
            professional profile.
          </p>
          <button
            onClick={() => navigate("/profile/edit")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Setup Profile
          </button>
        </div>
      </div>
    );
  }

  // Normal Profile Display (LinkedIn-style)
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header with cover and avatar */}
        <div className="relative">
          <div className="h-40 bg-indigo-600"></div>
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl font-bold text-indigo-600">
              {userData?.name?.[0]}
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="mt-20 px-8 pb-8">
          {/* Name + Email */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData?.name}
            </h1>
            <p className="text-gray-500">{userData?.email}</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">About</h2>
            <p className="text-gray-600">
              {profile.bio || "No bio added yet."}
            </p>
          </div>

          {/* Skills Offered */}
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

          {/* Skills Needed */}
          <div className="mb-6">
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

          {/* ✅ Buttons for update + explore */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Update Profile
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Explore Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
