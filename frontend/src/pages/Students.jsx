import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import StudentForm from '../components/forms/StudentForm';
import { useAuth } from '../context/AuthContextState';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    X,
    User,
    Mail,
    Hash,
    BookOpen,
    Calendar,
    MapPin,
    UserCheck,
    KeyRound,
    Users,
    UserX,
    GraduationCap,
    ChevronRight,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

// ─── Palette ─────────────────────────────────────────────────────────────────
const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 'md' }) => {
    const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-16 h-16 text-2xl' };
    return (
        <div
            className={`${sizes[size]} rounded-xl flex items-center justify-center font-extrabold shrink-0`}
            style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: '#fff' }}
        >
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const active = (status ?? 'active') === 'active';
    return (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold`}
            style={{
                backgroundColor: active ? '#dcfce7' : '#fee2e2',
                color: active ? '#16a34a' : '#dc2626',
            }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: active ? '#16a34a' : '#dc2626' }}
            />
            {active ? 'Active' : 'Inactive'}
        </span>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 min-w-0">
        <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: P.soft }}>
            <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
            <p className="text-2xl font-extrabold truncate" style={{ color: P.primary }}>{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide truncate" style={{ color: P.muted }}>{label}</p>
        </div>
    </div>
);

// ─── Message Display ───────────────────────────────────────────────────────────
const MessageDisplay = ({ message }) => {
    if (!message.type) return null;

    const isSuccess = message.type === 'success';
    return (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm animate-pulse">
            {isSuccess ? (
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#16a34a' }} />
            ) : (
                <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#dc2626' }} />
            )}
            <p className="text-sm font-medium" style={{
                color: isSuccess ? '#16a34a' : '#dc2626',
                backgroundColor: isSuccess ? '#dcfce7' : '#fef2f2',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`
            }}>
                {message.text}
            </p>
        </div>
    );
};

// ─── Password Row ─────────────────────────────────────────────────────────────
const PasswordInfoRow = ({ value }) => {
    const [show, setShow] = useState(false);
    return (
        <div
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: `1px solid ${P.soft}` }}
        >
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                <KeyRound className="w-4 h-4" style={{ color: P.secondary }} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Password</p>
                <div className="flex items-center justify-between mt-0.5">
                    <p className="font-semibold truncate" style={{ color: P.primary }}>
                        {show ? (value || '—') : '••••••••'}
                    </p>
                    <button
                        onClick={() => setShow(s => !s)}
                        className="ml-2 p-1.5 rounded-lg transition-colors shrink-0"
                        style={{ color: P.muted }}
                        onMouseEnter={e => e.currentTarget.style.color = P.primary}
                        onMouseLeave={e => e.currentTarget.style.color = P.muted}
                        title={show ? 'Hide password' : 'Show password'}
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Student View Modal ────────────────────────────────────────────────────────
const StudentViewModal = ({ student, onClose }) => {
    if (!student) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            {/* Sheet on mobile, centered card on sm+ */}
            <div
                className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
                style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
            >
                {/* Drag handle (mobile) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Header */}
                <div
                    className="p-5 flex items-center gap-4"
                    style={{ background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})` }}
                >
                    <Avatar name={student.name} size="lg" />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-extrabold text-white truncate">{student.name}</h2>
                        <p className="text-sm truncate" style={{ color: '#C7D6F5' }}>{student.email}</p>
                        <StatusBadge status={student.status} />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/10 shrink-0"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <Hash className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Admission No</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>{student.admission_no || '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <BookOpen className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Class / Section</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>{student.class_name || 'N/A'} — {student.section_name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <UserCheck className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Gender</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>{student.gender || '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <Calendar className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Date of Birth</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>{student.dob ? new Date(student.dob).toLocaleDateString() : '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <Mail className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Email / Phone</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>
                                {student.email || '—'} 
                                {student.phone && <span className="text-gray-400 font-normal ml-2">({student.phone})</span>}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <Users className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Parent / Guardian</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>
                                {student.parent_name || '—'}
                                {student.parent_phone && <span className="text-gray-400 font-normal ml-2">({student.parent_phone})</span>}
                            </p>
                            {student.occupation && <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">{student.occupation}</p>}
                        </div>
                    </div>

                    <PasswordInfoRow value={student.password} />
                    <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${P.soft}` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: P.soft }}>
                            <MapPin className="w-4 h-4" style={{ color: P.secondary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.muted }}>Address</p>
                            <p className="font-semibold mt-0.5 truncate" style={{ color: P.primary }}>{student.address || '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: P.soft, color: P.primary }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Mobile Student Card ───────────────────────────────────────────────────────
const StudentCard = ({ student, onView, onEdit, onDelete, isAdmin }) => (
    <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 transition-transform active:scale-[0.98]"
    >
        <div className="flex items-center gap-3">
            <Avatar name={student.name} size="md" />
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{student.name}</p>
                <p className="text-xs text-gray-500 truncate">{student.email}</p>
            </div>
            <StatusBadge status={student.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: P.soft }}>
                <p className="uppercase font-semibold tracking-wide" style={{ color: P.muted }}>Admission No</p>
                <p className="font-bold mt-0.5 truncate" style={{ color: P.primary }}>{student.admission_no}</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ backgroundColor: P.soft }}>
                <p className="uppercase font-semibold tracking-wide" style={{ color: P.muted }}>Class</p>
                <p className="font-bold mt-0.5 truncate" style={{ color: P.primary }}>{student.class_name || 'N/A'} – {student.section_name || 'N/A'}</p>
            </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
            <button
                onClick={() => onView(student)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: P.soft, color: P.secondary }}
            >
                <Eye className="w-4 h-4" /> View
            </button>
            {isAdmin && (
                <>
                    <button
                        onClick={() => onEdit(student)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ backgroundColor: '#EEF2FF', color: P.primary }}
                    >
                        <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(student.id)}
                        className="flex items-center justify-center p-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gray-100" /><div className="space-y-2"><div className="h-3 bg-gray-100 rounded w-28" /><div className="h-2.5 bg-gray-100 rounded w-36" /></div></div></td>
        <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-24" /></td>
        <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-20" /></td>
        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-16" /></td>
        <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-100 rounded-xl w-24 ml-auto" /></td>
    </tr>
);

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gray-100" /><div className="flex-1 space-y-2"><div className="h-3 bg-gray-100 rounded w-32" /><div className="h-2.5 bg-gray-100 rounded w-40" /></div></div>
        <div className="grid grid-cols-2 gap-2"><div className="h-12 bg-gray-100 rounded-xl" /><div className="h-12 bg-gray-100 rounded-xl" /></div>
        <div className="flex gap-2 pt-1 border-t border-gray-50"><div className="flex-1 h-10 bg-gray-100 rounded-xl" /><div className="flex-1 h-10 bg-gray-100 rounded-xl" /><div className="w-10 h-10 bg-gray-100 rounded-xl" /></div>
    </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ query, onAdd, isAdmin }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: P.soft }}>
            <GraduationCap className="w-10 h-10" style={{ color: P.light }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: P.primary }}>
            {query ? 'No results found' : 'No students yet'}
        </h3>
        <p className="text-sm mb-6 max-w-xs" style={{ color: P.muted }}>
            {query
                ? `No students match "${query}". Try a different search term.`
                : 'Get started by adding your first student admission.'}
        </p>
        {!query && isAdmin && (
            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: P.primary }}
            >
                <Plus className="w-4 h-4" /> New Admission
            </button>
        )}
    </div>
);

// ─── Students Page ────────────────────────────────────────────────────────────
const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [viewStudent, setViewStudent] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleSubmit = async (formData) => {
        try {
            if (selectedStudent) {
                await api.put(`/students/${selectedStudent.id}`, formData);
                setMessage({ type: 'success', text: 'Student updated successfully!' });
            } else {
                await api.post('/students', formData);
                setMessage({ type: 'success', text: 'Student admitted successfully!' });
            }
            fetchStudents();
            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error('Action failed', err);
            const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
            setMessage({ type: 'error', text: errorMsg });
            // Clear error message after 5 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (err) {
                console.error('Delete failed:', err.response?.data || err.message);
            }
        }
    };

    const handleEdit = (student) => { setSelectedStudent(student); setIsFormOpen(true); };
    const handleAdd = () => { setSelectedStudent(null); setIsFormOpen(true); };
    const handleView = (student) => setViewStudent(student);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.admission_no.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = students.filter(s => (s.status ?? 'active') === 'active').length;
    const inactiveCount = students.length - activeCount;

    return (
        <Layout>
            {/* Message Display */}
            <MessageDisplay message={message} />

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: P.primary }}>
                        Student Directory
                    </h1>
                    <p className="text-sm mt-1" style={{ color: P.muted }}>
                        Manage admissions, profiles and academic history.
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 text-white px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-[0.97] shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                        style={{ backgroundColor: P.primary, boxShadow: '0 8px 20px rgba(61,82,160,0.25)' }}
                    >
                        <Plus className="w-5 h-5" />
                        New Admission
                    </button>
                )}
            </div>

            {/* ── Stats Bar ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <StatCard icon={Users} label="Total Students" value={students.length} color={P.primary} />
                <StatCard icon={UserCheck} label="Active" value={activeCount} color="#16a34a" />
                <StatCard icon={UserX} label="Inactive" value={inactiveCount} color="#dc2626" />
            </div>

            {/* ── Search Bar ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 p-4 flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: P.muted }}
                    />
                    <input
                        type="text"
                        placeholder="Search by name or admission no…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                        style={{ backgroundColor: P.soft, color: P.primary }}
                        onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${P.light}`}
                        onBlur={e => e.target.style.boxShadow = 'none'}
                    />
                </div>
                <p className="text-sm font-semibold whitespace-nowrap" style={{ color: P.muted }}>
                    {filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* ── Desktop Table (hidden on mobile) ── */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs uppercase tracking-wider font-bold" style={{ backgroundColor: P.soft, color: P.muted }}>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Admission No</th>
                                <th className="px-6 py-4">Class / Section</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <EmptyState query={search} onAdd={handleAdd} isAdmin={isAdmin} />
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map(student => (
                                    <tr
                                        key={student.id}
                                        className="group transition-colors"
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = P.soft}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={student.name} size="md" />
                                                <div>
                                                    <p className="font-bold text-gray-800 group-hover:text-[#3D52A0] transition-colors">{student.name}</p>
                                                    <p className="text-xs text-gray-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-600 text-sm">{student.admission_no}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.class_name || 'N/A'} — {student.section_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={student.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end items-center gap-1">
                                                <button
                                                    onClick={() => handleView(student)}
                                                    title="View Details"
                                                    className="p-2 rounded-lg transition-all text-gray-400 hover:text-[#7091E6] hover:bg-[#EDE8F5]"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(student)}
                                                            title="Edit"
                                                            className="p-2 rounded-lg transition-all text-gray-400 hover:text-[#3D52A0] hover:bg-[#EDE8F5]"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(student.id)}
                                                            title="Delete"
                                                            className="p-2 rounded-lg transition-all text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Mobile Card Grid (hidden on md+) ── */}
            <div className="md:hidden">
                {loading ? (
                    <div className="grid gap-4">
                        {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100">
                        <EmptyState query={search} onAdd={handleAdd} />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredStudents.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Forms & Modals ── */}
            <StudentForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                student={selectedStudent}
                onSubmit={handleSubmit}
            />

            <StudentViewModal
                student={viewStudent}
                onClose={() => setViewStudent(null)}
            />
        </Layout>
    );
};

export default Students;
