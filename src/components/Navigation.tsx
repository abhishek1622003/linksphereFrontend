import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProfileEditModal from "./ProfileEditModal";
import Logo from "./Logo";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : 'User';
  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'U';

  return (
    <>
      <header className="bg-white border-b border-linkedin-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Logo size="sm" />
                <span className="text-xl font-semibold text-gray-900">LinkSphere</span>
              </Link>
            </div>

            <nav className="flex items-center space-x-6">
              <Link href="/" className={`flex flex-col items-center transition-colors ${
                location === '/' ? 'text-linkedin-blue' : 'text-gray-600 hover:text-linkedin-blue'
              }`}>
                <i className="fas fa-home text-xl"></i>
                <span className="text-xs mt-1 hidden sm:block">Home</span>
              </Link>
              
              <Link href={`/profile/${user?.id}`} className={`flex flex-col items-center transition-colors ${
                location.startsWith('/profile') ? 'text-linkedin-blue' : 'text-gray-600 hover:text-linkedin-blue'
              }`}>
                <i className="fas fa-user text-xl"></i>
                <span className="text-xs mt-1 hidden sm:block">Profile</span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="flex flex-col items-center text-gray-600 hover:text-linkedin-blue transition-colors"
              >
                <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
                <span className="text-xs mt-1 hidden sm:block">{isDark ? 'Light' : 'Dark'}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-400 transition-colors">
                      {userInitials}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <ProfileEditModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}
