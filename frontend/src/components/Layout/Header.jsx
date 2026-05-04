import { useEffect, useRef, useState } from "react";
import { Search, Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

export default function Header({ title = "Dashboard" }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white/90 backdrop-blur-xl border-b border-surface-300/50 shadow-sm">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-surface-900">{title}</h2>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-60 pl-9 pr-4 py-2 rounded-lg bg-surface-100 border border-surface-300/60 text-sm text-surface-700 placeholder-surface-400 focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        <div className="relative" ref={accountRef}>
          <button
            type="button"
            onClick={() => setIsAccountOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #16a34a 0%, #10b981 100%)",
              }}
            >
              <UserCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-surface-600 hidden lg:block">
              {user?.username || "Admin"}
            </span>
          </button>

          {isAccountOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-surface-300/60 bg-white shadow-xl p-4">
              <p className="text-xs uppercase tracking-wide text-surface-400">
                Account Details
              </p>
              <p className="mt-2 text-sm font-semibold text-surface-900">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-surface-500">
                {user?.roleName || "User"}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
