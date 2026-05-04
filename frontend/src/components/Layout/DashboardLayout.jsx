import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles = {
  '/': 'Dashboard',
  '/patients': 'Patient Management',
  '/patients/new': 'Register Patient',
  '/doctors': 'Doctor Management',
  '/appointments': 'Appointments',
  '/prescriptions': 'Prescriptions',
  '/inventory': 'Inventory & Medicine',
  '/suppliers': 'Suppliers & Orders',
  '/billing': 'Billing',
  '/lab': 'Lab Management',
};

export default function DashboardLayout() {
  const location = useLocation();

  // Match title from path (handle dynamic routes like /patients/:id/edit)
  const title =
    pageTitles[location.pathname] ||
    (location.pathname.includes('/patients') ? 'Patient Management' : 'SHIIS');

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar />

      {/* Main Content — offset by sidebar width */}
      <div className="flex-1 ml-[260px] transition-all duration-300 flex flex-col">
        <Header title={title} />

        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
