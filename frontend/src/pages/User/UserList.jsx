import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import userService from "../../api/services/userService";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);
  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      if (search.trim()) {
        const result = await userService.search(search);
        const rows = Array.isArray(result) ? result : result?.data || [];
        setUsers(rows);
        setTotal(rows.length);
        return;
      }

      const result = await userService.getAll(page, limit);
      setUsers(result?.data || []);
      setTotal(result?.total || 0);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load users.";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, search ? 400 : 0);
    return () => clearTimeout(debounce);
  }, [fetchUsers, search]);

  const handleDelete = async () => {
    if (!deleteModal.user) return;

    setDeleting(true);
    try {
      await userService.delete(deleteModal.user.userId || deleteModal.user.id);
      const name = deleteModal.user.username || deleteModal.user.name;
      setDeleteModal({ open: false, user: null });
      toast.success(`User "${name}" deleted successfully.`);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete user.";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      width: "80px",
      render: (row) => (
        <span className="text-surface-500 font-mono text-xs">
          #{row.userId || row.id || "-"}
        </span>
      ),
    },
    {
      key: "username",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-xs font-bold text-primary-600 border border-primary-500/20">
            {(row.username || row.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-surface-900">
              {row.username || row.name || "-"}
            </p>
            <p className="text-xs text-surface-500">
              {row.roleName || row.role || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "roleName",
      label: "Role",
      render: (row) => row.roleName || row.role || "-",
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
              navigate(`/users/${row.userId || row.id}/edit`);
            }}
            className="p-1.5 rounded-lg text-surface-400 hover:text-accent-400 hover:bg-accent-500/10 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ open: true, user: row });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Users</h1>
          <p className="text-sm text-surface-500 mt-1">
            Manage system users and roles
          </p>
        </div>
        <Button onClick={() => navigate("/users/new")}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-surface-300/60 text-sm text-surface-700 placeholder-surface-400 focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 transition-all"
        />
      </div>

      {loading ? (
        <Loader text="Fetching users..." />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
          emptyMessage="No users found"
        />
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete User"
        size="sm"
      >
        <p className="text-sm text-surface-600 mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-surface-900">
            {deleteModal.user?.username || deleteModal.user?.name}
          </strong>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, user: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
