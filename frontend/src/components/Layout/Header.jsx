import { Search, Bell, UserCircle } from 'lucide-react';

export default function Header({ title = 'Dashboard' }) {
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-surface-900/60 backdrop-blur-xl border-b border-surface-700/30">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-60 pl-9 pr-4 py-2 rounded-lg bg-surface-800/60 border border-surface-700/40 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/60 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-800/60 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-surface-300 hidden lg:block">Admin</span>
        </button>
      </div>
    </header>
  );
}
