import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, LogOut, Home, Settings } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { state, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="relative max-w-xs w-full h-full bg-white shadow-xl">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Todo App</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-5 px-2 space-y-1">
            <Link
              href="/dashboard"
              className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              onClick={onClose}
            >
              <Home className="mr-4 h-6 w-6 text-gray-500" />
              Dashboard
            </Link>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md text-left"
            >
              <LogOut className="mr-4 h-6 w-6 text-gray-500" />
              Logout
            </button>
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-700">
                {state.user?.name || state.user?.email}
              </p>
              <p className="text-sm font-medium text-gray-500">View profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;