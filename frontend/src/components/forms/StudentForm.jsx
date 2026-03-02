import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';

const StudentForm = ({ isOpen, onClose, student, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        admission_no: '',
        class_id: '',
        section_id: '',
        dob: '',
        gender: 'male',
        address: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                ...student,
                class_id: student.class_id || '',
                section_id: student.section_id || '',
                dob: student.dob ? student.dob.split('T')[0] : '',
                status: student.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                admission_no: '',
                class_id: '',
                section_id: '',
                dob: '',
                gender: 'male',
                address: '',
                status: 'active'
            });
        }
    }, [student, isOpen]);

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
                    <h2 className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{student ? 'Edit Student' : 'New Admission'}</h2>
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
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Student's name"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Email"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        {!student && (
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Admission No</label>
                            <input
                                required
                                value={formData.admission_no}
                                onChange={(e) => setFormData({...formData, admission_no: e.target.value})}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="ADM-001"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Class ID</label>
                            <input
                                type="number"
                                value={formData.class_id}
                                onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Class ID"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Section ID</label>
                            <input
                                type="number"
                                value={formData.section_id}
                                onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                                className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all"
                                style={{ backgroundColor: '#EDE8F5' }}
                                placeholder="Section ID"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D52A0' }}>Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({...formData, dob: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
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
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-4 py-3 border-none rounded-xl outline-none transition-all min-h-[100px]"
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
                            className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white px-8 py-3 rounded-xl transition-all font-bold flex items-center space-x-2 hover:opacity-90"
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
