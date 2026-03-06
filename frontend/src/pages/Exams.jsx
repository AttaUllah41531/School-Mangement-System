import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import ExamForm from '../components/forms/ExamForm';
import { 
    Plus, 
    ClipboardList, 
    Calendar, 
    Edit2, 
    Trash2, 
    ChevronRight, 
    Users, 
    CheckCircle, 
    AlertCircle,
    Search,
    BookOpen,
    Trophy
} from 'lucide-react';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    return (
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
};

const MessageDisplay = ({ message }) => {
    if (!message.type) return null;
    const isSuccess = message.type === 'success';
    return (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm animate-in slide-in-from-right duration-300">
            <div className="p-2 rounded-lg" style={{ backgroundColor: isSuccess ? '#dcfce7' : '#fee2e2' }}>
                {isSuccess ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            </div>
            <p className="text-sm font-bold text-gray-800">{message.text}</p>
        </div>
    );
};

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [search, setSearch] = useState('');

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await api.get('/exams');
            setExams(res.data);
        } catch (err) {
            console.error('Error fetching exams', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExams(); }, []);

    const handleSubmit = async (formData) => {
        try {
            if (selectedExam) {
                await api.put(`/exams/${selectedExam.id}`, formData);
                setMessage({ type: 'success', text: 'Exam updated successfully!' });
            } else {
                await api.post('/exams', formData);
                setMessage({ type: 'success', text: 'Exam scheduled successfully!' });
            }
            setIsFormOpen(false);
            fetchExams();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Operation failed';
            setMessage({ type: 'error', text: errorMsg });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam? This will also delete all associated marks.')) {
            try {
                await api.delete(`/exams/${id}`);
                fetchExams();
                setMessage({ type: 'success', text: 'Exam deleted successfully!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch {
                setMessage({ type: 'error', text: 'Failed to delete exam' });
            }
        }
    };

    const handleEdit = (exam) => { setSelectedExam(exam); setIsFormOpen(true); };
    const handleAdd = () => { setSelectedExam(null); setIsFormOpen(true); };

    const filteredExams = exams.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase()) || 
        e.term.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <MessageDisplay message={message} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold" style={{ color: P.primary }}>Examinations</h1>
                    <p className="text-sm font-medium" style={{ color: P.muted }}>Schedule exams and manage student marks.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-[0.97] w-full sm:w-auto justify-center"
                    style={{ backgroundColor: P.primary, boxShadow: `0 8px 20px ${P.primary}33` }}
                >
                    <Plus className="w-5 h-5" />
                    New Schedule
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <StatCard icon={ClipboardList} label="Total Exams" value={exams.length} color={P.primary} />
                <StatCard icon={Calendar} label="Active" value={exams.filter(e => new Date(e.end_date) >= new Date()).length} color="#16a34a" />
                <StatCard icon={Trophy} label="Avg Grade" value="A" color="#ca8a04" />
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                <input
                    type="text"
                    placeholder="Search examinations..."
                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-none outline-none text-sm font-medium transition-all shadow-sm"
                    style={{ backgroundColor: P.soft, color: P.primary }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Exam List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-48 rounded-2xl bg-white animate-pulse border border-gray-100" />
                    ))
                ) : filteredExams.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ backgroundColor: P.soft }}>
                            <ClipboardList className="w-8 h-8" style={{ color: P.light }} />
                        </div>
                        <h3 className="text-lg font-bold" style={{ color: P.primary }}>No examinations found</h3>
                        <p className="text-sm" style={{ color: P.muted }}>Start by scheduling your first school exam.</p>
                    </div>
                ) : (
                    filteredExams.map(exam => (
                        <div key={exam.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl" style={{ backgroundColor: P.soft }}>
                                    <ClipboardList className="w-6 h-6" style={{ color: P.primary }} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(exam)} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-1 truncate" style={{ color: P.primary }}>{exam.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider" style={{ backgroundColor: P.soft, color: P.primary }}>{exam.term}</span>
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{exam.academic_year}</span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-50 mb-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="font-semibold text-gray-600">
                                        {new Date(exam.start_date).toLocaleDateString()} — {new Date(exam.end_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all hover:gap-3"
                                style={{ backgroundColor: P.soft, color: P.primary }}
                            >
                                <Users className="w-4 h-4" />
                                <span>Manage Marks</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <ExamForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                exam={selectedExam}
                onSubmit={handleSubmit}
            />
        </Layout>
    );
};

export default Exams;
