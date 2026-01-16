import React from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { User, Home, Settings, LogOut } from 'lucide-react';

interface DesktopSidebarProps {
  className?: string;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ className = '' }) => {
  const { state, logout } = useAuth();

  return (
    <div className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 ${className}`}>
      <div className="flex-1 flex flex-col min-h-0 border-r bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">Todo App</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <Home className="mr-3 h-6 w-6 text-gray-500" />
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="w-full text-gray-700 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-left"
            >
              <LogOut className="mr-3 h-6 w-6 text-gray-500" />
              Logout
            </button>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {state.user?.name || state.user?.email}
              </p>
              <p className="text-xs font-medium text-gray-500">Account Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;