import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import appointmentService from "../../api/services/appointmentService";
import patientService from "../../api/services/patientService";
import FormInput from "../../components/common/FormInput";
import FormSelect from "../../components/common/FormSelect";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const statusOptions = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "No Show", label: "No Show" },
];

const initialForm = {
  patientId: "",
  doctorName: "",
  appointmentDate: "",
  appointmentTime: "",
  status: "Scheduled",
  reason: "",
  notes: "",
};

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Load patients for dropdown
  useEffect(() => {
    setLoadingPatients(true);
    patientService
      .getAll(1, 200)
      .then((res) => {
        setPatients(res.data || []);
      })
      .catch(() => {
        toast.error("Failed to load patient list.");
      })
      .finally(() => setLoadingPatients(false));
  }, []);

  // Load existing appointment for edit
  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      appointmentService
        .getById(id)
        .then((appt) => {
          setForm({
            patientId: appt.patientId || "",
            doctorName: appt.doctorName || "",
            appointmentDate: appt.appointmentDate
              ? appt.appointmentDate.split("T")[0]
              : "",
            appointmentTime: appt.appointmentTime || "",
            status: appt.status || "Scheduled",
            reason: appt.reason || "",
            notes: appt.notes || "",
          });
        })
        .catch(() => {
          toast.error("Failed to load appointment data.");
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.patientId) errs.patientId = "Patient is required";
    if (!form.doctorName.trim()) errs.doctorName = "Doctor name is required";
    if (!form.appointmentDate)
      errs.appointmentDate = "Appointment date is required";
    if (!form.appointmentTime)
      errs.appointmentTime = "Appointment time is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        patientId: Number(form.patientId),
      };

      if (isEdit) {
        await appointmentService.update(id, payload);
        toast.success("Appointment updated successfully!");
      } else {
        await appointmentService.create(payload);
        toast.success("Appointment created successfully!");
        setForm(initialForm);
      }
      setTimeout(() => navigate("/appointments"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  const patientOptions = patients.map((p) => ({
    value: p.patientId,
    label: `${p.firstName} ${p.lastName} (#${p.patientId})`,
  }));

  if (fetching) return <Loader text="Loading appointment data..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/appointments")}
          className="p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            {isEdit ? "Edit Appointment" : "Schedule New Appointment"}
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {isEdit
              ? "Update appointment information"
              : "Fill in the details to schedule a new appointment"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {/* Patient + Doctor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Patient"
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            options={patientOptions}
            error={errors.patientId}
            required
            placeholder={loadingPatients ? "Loading patients..." : "Select patient..."}
          />
          <FormInput
            label="Doctor Name"
            name="doctorName"
            value={form.doctorName}
            onChange={handleChange}
            error={errors.doctorName}
            required
            placeholder="Dr. John Smith"
          />
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Appointment Date"
            name="appointmentDate"
            type="date"
            value={form.appointmentDate}
            onChange={handleChange}
            error={errors.appointmentDate}
            required
          />
          <FormInput
            label="Appointment Time"
            name="appointmentTime"
            type="time"
            value={form.appointmentTime}
            onChange={handleChange}
            error={errors.appointmentTime}
            required
          />
        </div>

        {/* Status + Reason */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statusOptions}
            error={errors.status}
          />
          <FormInput
            label="Reason for Visit"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            error={errors.reason}
            placeholder="General checkup, follow-up, etc."
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-surface-600"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional notes or instructions..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-[var(--radius-input)] text-sm bg-white border border-surface-300/70 text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/60 transition-all duration-200 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200/60">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/appointments")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save className="w-4 h-4" />
            {isEdit ? "Update Appointment" : "Schedule Appointment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
