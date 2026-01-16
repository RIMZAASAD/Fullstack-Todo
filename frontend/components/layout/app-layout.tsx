import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  ListTodo,
  Sparkles,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, showSidebar = true }) => {
  const { state, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <div className="glass flex items-center justify-between p-3.5 px-5 rounded-[2rem] border-white/5 shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <ListTodo size={18} />
            </div>
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent uppercase">Planit</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-300 bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 md:z-30 w-72 transition-all duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${showSidebar ? 'flex' : 'hidden'}`}
      >
        <div className="flex-1 flex flex-col m-4 mr-0 rounded-[32px] glass border-white/5 overflow-hidden">
          <div className="p-8 flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2 rounded-xl text-white">
              <ListTodo size={24} />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">Planit</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Workspace</p>
              <div className="space-y-1">
                <SidebarNavLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <SidebarNavLink
                  href="/tasks"
                  icon={<ListTodo size={20} />}
                  label="My Tasks"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Account</p>
              <div className="space-y-1">
                <SidebarNavLink
                  href="/settings"
                  icon={<Settings size={20} />}
                  label="Settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <SidebarNavLink
                  href="/notifications"
                  icon={<Bell size={20} />}
                  label="Notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </div>
          </nav>

          <footer className="p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 mb-4 max-w-full">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                {state.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-bold truncate text-white">{state.user?.name || 'Pro User'}</p>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter flex items-center gap-1">
                  <Sparkles size={10} className="text-indigo-400" /> PRO PLAN
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center mb-4">
              <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2 md:mb-3">Connect With Us</p>
              <div className="flex justify-center gap-2 md:gap-3">
                <Link
                  href="https://www.linkedin.com/in/rimza-asad-206b332b8/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={14} className="group-hover:scale-110 transition-transform" />
                </Link>
                <Link
                  href="https://github.com/RIMZAASAD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
                  aria-label="GitHub"
                >
                  <Github size={14} className="group-hover:scale-110 transition-transform" />
                </Link>
                <Link
                  href="https://stackoverflow.com/users/30621843/rimza-asad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
                  aria-label="Stack Overflow"
                >
                  <Globe size={14} className="group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group font-semibold text-sm"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </footer>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${showSidebar ? 'md:pl-72' : ''}`}>
        <main className="min-h-screen p-4 md:p-8 pt-24 md:pt-8 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

function SidebarNavLink({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group font-semibold text-sm"
    >
      <span className="group-hover:text-indigo-400 transition-colors">{icon}</span>
      {label}
    </Link>
  );
}

export default AppLayout;