import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import patientService from '../../api/services/patientService';
import FormInput from '../../components/common/FormInput';
import FormSelect from '../../components/common/FormSelect';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const initialForm = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
};

export default function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');

  // Load existing patient for edit
  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      patientService
        .getById(id)
        .then((patient) => {
          setForm({
            firstName: patient.firstName || '',
            lastName: patient.lastName || '',
            dob: patient.dob ? patient.dob.split('T')[0] : '',
            gender: patient.gender || '',
            phone: patient.phone || '',
            email: patient.email || '',
            address: patient.address || '',
          });
        })
        .catch((err) => {
          console.error('Failed to load patient:', err);
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.dob) errs.dob = 'Date of birth is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email address';
    }
    if (form.phone && !/^[\d\s\-+()]{7,15}$/.test(form.phone)) {
      errs.phone = 'Invalid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess('');
    try {
      if (isEdit) {
        await patientService.update(id, form);
        setSuccess('Patient updated successfully!');
      } else {
        await patientService.create(form);
        setSuccess('Patient created successfully!');
        setForm(initialForm);
      }
      setTimeout(() => navigate('/patients'), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrors({ submit: Array.isArray(msg) ? msg.join(', ') : msg });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading patient data..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Edit Patient' : 'Register New Patient'}
          </h1>
          <p className="text-sm text-surface-400 mt-0.5">
            {isEdit ? 'Update patient information' : 'Fill in the details to register a new patient'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {/* Success */}
        {success && (
          <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
            {success}
          </div>
        )}

        {/* Server Error */}
        {errors.submit && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fade-in">
            {errors.submit}
          </div>
        )}

        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            placeholder="John"
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            placeholder="Doe"
          />
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            error={errors.dob}
            required
          />
          <FormSelect
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={genderOptions}
            error={errors.gender}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+91 9876543210"
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
          />
        </div>

        {/* Address */}
        <FormInput
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="123 Main Street, City"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-surface-700/30">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/patients')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Patient' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </div>
  );
}
