import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';

const TeacherForm = ({ isOpen, onClose, teacher, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        employee_id: '',
        qualification: '',
        experience_years: '',
        salary: '',
        joining_date: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (teacher) {
            setFormData({
                ...teacher,
                joining_date: teacher.joining_date ? teacher.joining_date.split('T')[0] : '',
                status: teacher.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                employee_id: '',
                qualification: '',
                experience_years: '',
                salary: '',
                joining_date: '',
                status: 'active'
            });
        }
    }, [teacher, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div style={{ borderBottomColor: '#EDE8F5' }} className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{teacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8F5'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                        <X className="w-6 h-6" style={{ color: '#8697C4' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Full Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Teacher's name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Email"
                            />
                        </div>
                        {!teacher && (
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all pr-12"
                                    style={{ backgroundColor: '#EDE8F5' }}
                                        placeholder="••••••••"
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
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Employee ID</label>
                            <input
                                required
                                value={formData.employee_id}
                                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="EMP-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Experience (Years)</label>
                            <input
                                type="number"
                                value={formData.experience_years}
                                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Salary</label>
                            <input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Joining Date</label>
                            <input
                                type="date"
                                value={formData.joining_date}
                                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                            />
                        </div>
                        {teacher && (
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Qualification</label>
                        <textarea
                            value={formData.qualification}
                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                            className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all min-h-25"
                            style={{ backgroundColor: '#EDE8F5' }}
                            placeholder="Degrees and certifications"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white px-8 py-3 rounded-xl transition-all font-bold flex items-center space-x-2 hover:opacity-90"
                            style={{ backgroundColor: '#7091E6', boxShadow: '0 8px 20px rgba(112,145,230,0.3)' }}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{teacher ? 'Save Changes' : 'Add Teacher'}</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherForm;
