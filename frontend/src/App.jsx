import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientList from './pages/Patient/PatientList';
import PatientForm from './pages/Patient/PatientForm';

// Placeholder pages for future modules
function ComingSoon({ name }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-800/60 border border-surface-700/40 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
      <p className="text-sm text-surface-400 max-w-md">
        This module is under development. The foundation is in place — connect
        the backend module to activate.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Patient Module — COMPLETE */}
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id/edit" element={<PatientForm />} />

          {/* Future Modules — Placeholders */}
          <Route path="/doctors" element={<ComingSoon name="Doctor Management" />} />
          <Route path="/appointments" element={<ComingSoon name="Appointment System" />} />
          <Route path="/prescriptions" element={<ComingSoon name="Prescription System" />} />
          <Route path="/inventory" element={<ComingSoon name="Inventory & Medicine" />} />
          <Route path="/suppliers" element={<ComingSoon name="Suppliers & Purchase Orders" />} />
          <Route path="/billing" element={<ComingSoon name="Billing System" />} />
          <Route path="/lab" element={<ComingSoon name="Lab Management" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
