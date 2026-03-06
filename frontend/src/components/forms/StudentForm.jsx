import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StudentForm = ({ isOpen, onClose, student, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        admission_no: '',
        phone: '',
        parent_name: '',
        parent_phone: '',
        occupation: '',
        class_id: '',
        section_id: '',
        dob: '',
        gender: 'male',
        address: '',
        status: 'active'
    });
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAcademicData = async () => {
            try {
                // Fetch classes and sections from the academic routes
                const [classesRes, sectionsRes] = await Promise.all([
                    api.get('/academic/classes'),
                    api.get('/academic/sections')
                ]);
                setClasses(classesRes.data);
                setSections(sectionsRes.data);
            } catch (err) {
                console.error('Error fetching academic data:', err);
                // Don't show error immediately if we're just loading
            }
        };

        if (isOpen) {
            fetchAcademicData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (student && isOpen) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                password: '', // default to empty for updates
                admission_no: student.admission_no || '',
                phone: student.phone || '',
                parent_name: student.parent_name || '',
                parent_phone: student.parent_phone || '',
                occupation: student.occupation || '',
                class_id: student.class_id || '',
                section_id: student.section_id || '',
                dob: student.dob ? student.dob.split('T')[0] : '',
                gender: student.gender || 'male',
                address: student.address || '',
                status: student.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                admission_no: '',
                phone: '',
                parent_name: '',
                parent_phone: '',
                occupation: '',
                class_id: '',
                section_id: '',
                dob: '',
                gender: 'male',
                address: '',
                status: 'active'
            });
        }
        setError('');
    }, [student, isOpen]);

    useEffect(() => {
        if (formData.class_id) {
            const filtered = sections.filter(s => s.class_id === parseInt(formData.class_id));
            setFilteredSections(filtered);
        } else {
            setFilteredSections([]);
        }
    }, [formData.class_id, sections]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Basic client-side validation
            if (!formData.name.trim()) {
                throw new Error('Name is required');
            }
            if (!formData.email.trim()) {
                throw new Error('Email is required');
            }
            if (!formData.admission_no.trim()) {
                throw new Error('Admission number is required');
            }
            if (!student && !formData.password.trim()) {
                throw new Error('Password is required for new admission');
            }

            await onSubmit(formData);
            onClose();
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div style={{ borderBottomColor: '#EDE8F5' }} className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{student ? 'Edit Student' : 'New Admission'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8F5'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                        <X className="w-6 h-6" style={{ color: '#8697C4' }} />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                        <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#dc2626' }} />
                        <p className="text-sm font-medium" style={{ color: '#dc2626' }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Full Name *</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Student's name"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Email Address *</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Email"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        {!student && (
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Password *</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all pr-12"
                                        style={{ backgroundColor: '#EDE8F5' }}
                                        placeholder="••••••••"
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                                        style={{ color: '#8697C4' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#3D52A0'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#8697C4'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Admission No *</label>
                            <input
                                required
                                value={formData.admission_no}
                                onChange={(e) => setFormData({ ...formData, admission_no: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="ADM-001"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Phone Number</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="03XXXXXXXXX"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>

                        {/* Guard / Parent Section */}
                        <div className="md:col-span-2 mt-4">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#8697C4' }}>Parent / Guardian Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Parent/Guardian Name</label>
                                    <input
                                        value={formData.parent_name}
                                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                        className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                        style={{ backgroundColor: '#EDE8F5' }}
                                        placeholder="Father/Mother name"
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Parent Phone</label>
                                    <input
                                        value={formData.parent_phone}
                                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                        className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                        style={{ backgroundColor: '#EDE8F5' }}
                                        placeholder="03XXXXXXXXX"
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Occupation</label>
                                    <input
                                        value={formData.occupation}
                                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                        className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                        style={{ backgroundColor: '#EDE8F5' }}
                                        placeholder="Business / Job"
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Class</label>
                            <select
                                value={formData.class_id}
                                onChange={(e) => setFormData({ ...formData, class_id: e.target.value, section_id: '' })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5', color: '#3D52A0' }}
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Section</label>
                            <select
                                value={formData.section_id}
                                onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5', color: '#3D52A0' }}
                                disabled={!formData.class_id}
                            >
                                <option value="">Select Section</option>
                                {filteredSections.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5', color: '#3D52A0' }}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {student && (
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                    style={{ backgroundColor: '#EDE8F5', color: '#3D52A0' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Address</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all min-h-25"
                            style={{ backgroundColor: '#EDE8F5' }}
                            placeholder="Current address"
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white px-8 py-3 rounded-xl transition-all font-bold flex items-center space-x-2 hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: '#3D52A0', boxShadow: '0 8px 20px rgba(61,82,160,0.3)' }}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{student ? 'Save Changes' : 'Confirm Admission'}</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
