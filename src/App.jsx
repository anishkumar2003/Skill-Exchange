import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import ProfileSetup from "./pages/ProfileSetup";
import Explore from "./pages/explore";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileSetup />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  );
}
