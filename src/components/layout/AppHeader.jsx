import { useState } from "react";
import { Search, User, LogOut, Settings } from "lucide-react";
import Button from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Input from "../ui/Input";
import { SidebarTrigger } from "../ui/sidebar";
import { NotificationPanel } from "../notifications";
import useUserStore from "../../store/user.store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import SearchDropdown from "../search/SearchDropdown";
import Avatar from "../ui/Avatar";

export function AppHeader() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Use global search hook
  const { results, isLoading, hasQuery } = useGlobalSearch(searchQuery, 3);

  const handleLogout = async () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    localStorage.removeItem("expiresAt");
    logout();
    navigate("/");
    toast.success("Logout successful");
  };

  const handleViewAllNotifications = () => {
    navigate("/notifications");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <SidebarTrigger className="-ml-1" />
        
        {/* Search */}
        <div className="flex-1 mx-4 max-w-2xl relative">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) {
                  setShowDropdown(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setShowDropdown(false);
                }
              }}
            />
          </div>
          
          {/* Search Dropdown */}
          {showDropdown && hasQuery && (
            <SearchDropdown
              results={results}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onClose={() => setShowDropdown(false)}
              hasQuery={hasQuery}
            />
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <NotificationPanel 
            onViewAll={handleViewAllNotifications}
            showMarkAllAsRead={true}
            showViewAll={true}
          />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-8 w-8 rounded-full p-0 bg-transparent hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <Avatar
                  src={user?.profilePictureUrl}
                  fallback={user?.fname?.[0]?.toUpperCase() || user?.lname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                  className="h-8 w-8"
                  size="sm"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
