import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import patientService from "../../api/services/patientService";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    patient: null,
  });
  const [deleting, setDeleting] = useState(false);
  const limit = 15;

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      if (search.trim()) {
        const results = await patientService.search(search);
        setPatients(Array.isArray(results) ? results : []);
        setTotal(Array.isArray(results) ? results.length : 0);
      } else {
        const result = await patientService.getAll(page, limit);
        setPatients(result.data || []);
        setTotal(result.total || 0);
      }
    } catch {
      toast.error("Failed to fetch patients. Please try again.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const debounce = setTimeout(fetchPatients, search ? 400 : 0);
    return () => clearTimeout(debounce);
  }, [fetchPatients, search]);

  const handleDelete = async () => {
    if (!deleteModal.patient) return;
    setDeleting(true);
    try {
      await patientService.delete(deleteModal.patient.patientId);
      setDeleteModal({ open: false, patient: null });
      toast.success(
        `${deleteModal.patient.firstName} ${deleteModal.patient.lastName} has been archived.`,
      );
      fetchPatients();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete patient.";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "patientId",
      label: "ID",
      width: "70px",
      render: (row) => (
        <span className="text-surface-500 font-mono text-xs">
          #{row.patientId}
        </span>
      ),
    },
    {
      key: "name",
      label: "Patient Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-xs font-bold text-primary-600 border border-primary-500/20">
            {row.firstName?.[0]}
            {row.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-surface-900">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-surface-500">{row.email || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (row) => row.gender || "—",
    },
    {
      key: "dob",
      label: "Date of Birth",
      render: (row) =>
        row.dob ? new Date(row.dob).toLocaleDateString("en-IN") : "—",
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "—",
    },
    {
      key: "actions",
      label: "Actions",
      width: "120px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/patients/${row.patientId}/edit`);
            }}
            className="p-1.5 rounded-lg text-surface-400 hover:text-accent-400 hover:bg-accent-500/10 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ open: true, patient: row });
            }}
            className="p-1.5 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Patients</h1>
          <p className="text-sm text-surface-500 mt-1">
            Manage patient records and medical information
          </p>
        </div>
        <Button onClick={() => navigate("/patients/new")}>
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-surface-300/60 text-sm text-surface-700 placeholder-surface-400 focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Fetching patients..." />
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onRowClick={(row) => navigate(`/patients/${row.patientId}`)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, patient: null })}
        title="Archive Patient"
        size="sm"
      >
        <p className="text-sm text-surface-600 mb-6">
          Are you sure you want to archive{" "}
          <strong className="text-surface-900">
            {deleteModal.patient?.firstName} {deleteModal.patient?.lastName}
          </strong>
          ? The record will be preserved and can be restored later.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, patient: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Archive
          </Button>
        </div>
      </Modal>
    </div>
  );
}
