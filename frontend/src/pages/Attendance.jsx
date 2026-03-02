import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import { 
    Calendar as CalendarIcon, 
    Search, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    AlertCircle,
    Save,
    Loader2
} from 'lucide-react';

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filters, setFilters] = useState({
        class_id: '',
        section_id: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchInitialData = async () => {
        try {
            const classRes = await api.get('/academic/classes');
            setClasses(classRes.data);
            const sectionRes = await api.get('/academic/sections');
            setSections(sectionRes.data);
        } catch (err) {
            console.error('Error fetching initial academic data', err);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchAttendance = useCallback(async () => {
        if (!filters.class_id || !filters.section_id || !filters.date) return;
        
        setLoading(true);
        try {
            const res = await api.get('/attendance', { params: filters });
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching attendance', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const handleStatusChange = (studentId, status) => {
        setStudents(students.map(s => 
            s.id === studentId ? { ...s, attendance: { ...s.attendance, status } } : s
        ));
    };

    const handleMarkAll = (status) => {
        setStudents(students.map(s => ({ ...s, attendance: { ...s.attendance, status } })));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const attendanceData = students.map(s => ({
                student_id: s.id,
                status: s.attendance.status || 'present',
                remarks: s.attendance.remarks || ''
            }));
            await api.post('/attendance', { date: filters.date, attendanceData });
            setMessage({ type: 'success', text: 'Attendance saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error('Error saving attendance', err);
            setMessage({ type: 'error', text: 'Failed to save attendance.' });
        } finally {
            setSaving(false);
        }
    };

    const filteredSections = sections.filter(s => s.class_id == filters.class_id);

    const selectStyle = {
        border: '1px solid #ADBBDA',
        color: '#3D52A0',
        borderRadius: '12px',
        padding: '8px 16px',
        width: '100%',
        outline: 'none'
    };

    return (
        <Layout>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#3D52A0' }}>Attendance</h1>
                <p style={{ color: '#8697C4' }}>Track and manage student attendance.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Class</label>
                    <select
                        style={selectStyle}
                        value={filters.class_id}
                        onChange={(e) => setFilters({ ...filters, class_id: e.target.value, section_id: '' })}
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Section</label>
                    <select
                        style={selectStyle}
                        value={filters.section_id}
                        disabled={!filters.class_id}
                        onChange={(e) => setFilters({ ...filters, section_id: e.target.value })}
                    >
                        <option value="">Select Section</option>
                        {filteredSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Date</label>
                    <input
                        type="date"
                        style={selectStyle}
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={fetchAttendance}
                        disabled={loading || !filters.section_id}
                        style={{ backgroundColor: '#3D52A0' }}
                        className="flex-1 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-40 hover:opacity-90"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        <span>Search</span>
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center space-x-2 ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-semibold">{message.text}</span>
                </div>
            )}

            {students.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div style={{ borderBottomColor: '#EDE8F5' }} className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-lg font-bold" style={{ color: '#3D52A0' }}>Student List</h2>
                        <div className="flex space-x-2">
                            <button onClick={() => handleMarkAll('present')} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }} className="px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80 transition-all">Mark All Present</button>
                            <button onClick={() => handleMarkAll('absent')} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Mark All Absent</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{ backgroundColor: '#EDE8F5', color: '#8697C4' }} className="text-sm uppercase tracking-wider font-semibold">
                                    <th className="px-8 py-4">Student</th>
                                    <th className="px-6 py-4">Roll No</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="transition-colors"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8F5'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#ADBBDA', color: '#3D52A0' }}>
                                                    {student.name[0]}
                                                </div>
                                                <span className="font-bold text-gray-800">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{student.admission_no}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-1">
                                                {[
                                                    { id: 'present', icon: CheckCircle2, color: 'green' },
                                                    { id: 'absent', icon: XCircle, color: 'red' },
                                                    { id: 'late', icon: Clock, color: 'amber' },
                                                    { id: 'excused', icon: AlertCircle, color: 'gray' }
                                                ].map((status) => (
                                                    <button
                                                        key={status.id}
                                                        onClick={() => handleStatusChange(student.id, status.id)}
                                                        className={`p-2 rounded-lg transition-all ${
                                                            student.attendance.status === status.id
                                                            ? `bg-${status.color}-100 text-${status.color}-600`
                                                            : 'text-gray-400 hover:bg-gray-100'
                                                        }`}
                                                        title={status.id.charAt(0).toUpperCase() + status.id.slice(1)}
                                                    >
                                                        <status.icon className="w-5 h-5" />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ backgroundColor: '#EDE8F5', borderTopColor: '#ADBBDA' }} className="p-6 border-t flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            style={{ backgroundColor: '#3D52A0', boxShadow: '0 8px 20px rgba(61,82,160,0.3)' }}
                            className="text-white px-8 py-3 rounded-xl transition-all font-bold flex items-center space-x-2 hover:opacity-90"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>Save Attendance</span>
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Attendance;
