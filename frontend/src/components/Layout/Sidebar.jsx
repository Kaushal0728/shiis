import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Stethoscope,
  CalendarCheck,
  ClipboardList,
  Pill,
  Truck,
  Receipt,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

const ROLE_VISIBILITY = {
  admin: [
    "/",
    "/patients",
    "/doctors",
    "/appointments",
    "/prescriptions",
    "/inventory",
    "/suppliers",
    "/billing",
    "/lab",
    "/users",
  ],
  doctor: ["/", "/patients", "/appointments", "/prescriptions"],
  lab: ["/", "/patients", "/lab"],
};

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/prescriptions", label: "Prescriptions", icon: ClipboardList },
  { to: "/inventory", label: "Inventory", icon: Pill },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/lab", label: "Lab Management", icon: FlaskConical },
  { to: "/users", label: "Users", icon: UserCircle },
];

export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  const { user } = useAuth();
  const roleName = user?.roleName?.toLowerCase() || "user";
  const visiblePaths = ROLE_VISIBILITY[roleName] || ["/"];

  const visibleNavItems = navItems.filter((item) =>
    visiblePaths.includes(item.to),
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-[260px]"}
        bg-surface-900/80 backdrop-blur-2xl border-r border-surface-700/40`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-700/40">
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              SHIIS
            </h1>
            <p className="text-[10px] text-surface-400 leading-none mt-0.5">
              Healthcare Intelligence
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              }
              ${
                isActive
                  ? "bg-primary-500/15 text-primary-400 shadow-[inset_0_0_0_1px_rgba(13,148,136,0.2)]"
                  : "text-surface-400 hover:text-white hover:bg-surface-800/60"
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon
              className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                collapsed ? "w-6 h-6" : "w-5 h-5"
              }`}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex items-center justify-center h-12 border-t border-surface-700/40 text-surface-400 hover:text-white hover:bg-surface-800/60 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
