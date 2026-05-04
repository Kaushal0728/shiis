import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import userService from "../../api/services/userService";
import FormInput from "../../components/common/FormInput";
import FormSelect from "../../components/common/FormSelect";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Doctor", label: "Doctor" },
  { value: "Lab", label: "Lab" },
];

const initialForm = {
  username: "",
  roleName: "",
  password: "",
};

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    setFetching(true);
    userService
      .getById(id)
      .then((user) => {
        setForm((prev) => ({
          ...prev,
          username: user.username || user.name || "",
          roleName: user.roleName || user.role || "",
          password: "",
        }));
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Failed to load user.";
        setErrors({ submit: Array.isArray(msg) ? msg.join(", ") : msg });
      })
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.username.trim()) nextErrors.username = "Username is required";
    if (!form.roleName) nextErrors.roleName = "Role is required";

    if (!isEdit && !form.password.trim()) {
      nextErrors.password = "Password is required";
    }

    if (form.password && form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess("");

    try {
      const payload = {
        username: form.username.trim(),
        roleName: form.roleName,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (isEdit) {
        await userService.update(id, payload);
        setSuccess("User updated successfully!");
      } else {
        await userService.create(payload);
        setSuccess("User created successfully!");
        setForm(initialForm);
      }

      setTimeout(() => navigate("/users"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setErrors({ submit: Array.isArray(msg) ? msg.join(", ") : msg });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading user data..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit User" : "Create User"}</h1>
          <p className="text-sm text-surface-400 mt-0.5">
            {isEdit ? "Update user account information" : "Create a new user account with role access"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {success && (
          <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
            {success}
          </div>
        )}

        {errors.submit && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fade-in">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            required
            placeholder="john.doe"
          />
          <FormSelect
            label="Role"
            name="roleName"
            value={form.roleName}
            onChange={handleChange}
            options={roleOptions}
            error={errors.roleName}
            required
            placeholder="Select role"
          />
        </div>

        <FormInput
          label={isEdit ? "New Password (optional)" : "Password"}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required={!isEdit}
          placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-700/30">
          <Button type="button" variant="secondary" onClick={() => navigate("/users")}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save className="w-4 h-4" />
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
