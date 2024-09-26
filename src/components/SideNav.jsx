import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Gauge,
  AppWindowMac,
  Building2,
  UserPen,
  CircleHelp,
  LogOut,
} from "lucide-react";
import useUserStore from "../store/user.store";
import axios from "axios";
import UserProfile from "./UserProfile";

export default function SideNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const userLogout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false); // State for controlling the modal

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Gauge size={20} />,
    },
    {
      name: "Applications",
      href: "/applications",
      icon: <AppWindowMac size={20} />,
    },
    {
      name: "Companies",
      href: "/companies",
      icon: <Building2 size={20} />,
    },
    {
      name: "Employees",
      href: "/employees",
      icon: <UserPen size={20} />,
    },
    {
      name: "Questions",
      href: "/questions",
      icon: <CircleHelp size={20} />,
    },
  ];

  const handleLogout = async () => {
    try {
      // Attempt to send the logout request to the server
      await axios.post(
        "http://127.0.0.1:8000/api/token/logout",
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      // Successful logout
      userLogout(); // Function to clear user state (if any)
      localStorage.removeItem("token"); // Remove token from localStorage
      navigate("/login"); // Redirect to login page
      toast.success("Logout successful");
    } catch (error) {
      // Handle invalid or expired token
      if (error.response?.data?.detail === "Invalid token.") {
        // If the token is invalid, still proceed with logging the user out
        userLogout();
        localStorage.removeItem("token");
        navigate("/login");
        toast.warning("Session expired. You have been logged out.");
      } else {
        // Handle other errors
        toast.error("An error occurred while logging out. Please try again.");
      }
    }
  };

  return (
    <div className="w-[250px] flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="bg-primary py-7 px-8 text-xl font-semibold text-white">
          Company
        </div>
        <div className="flex flex-col">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`${
                pathname === item.href && "text-primary"
              } flex items-center gap-4 px-6 py-5 hover:bg-gray-100 text-sm transition-all`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-6">
        <div
          className="flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => {
            setProfileModalOpen(true); // Open the modal
          }}
        >
          <img
            src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
            className="h-10 w-10 rounded-full"
            alt="Profile"
          />
          <div className="flex flex-col">
            <p className="text-[16px]">{user?.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="hover:text-primary transition-all"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        open={isProfileModalOpen}
        setOpen={setProfileModalOpen}
        user={user}
      />
    </div>
  );
}
