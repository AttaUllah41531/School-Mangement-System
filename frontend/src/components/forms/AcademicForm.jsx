import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const AcademicForm = ({ isOpen, onClose, onSubmit, type, data, classes = [] }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData(data);
        } else {
            const defaults = {
                type: 'theory', // Default for subjects
                status: 'active'
            };
            setFormData(defaults);
        }
    }, [data, type]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderFields = () => {
        switch (type) {
            case 'class':
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Class Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Class 10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Description</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description"
                            />
                        </div>
                    </>
                );
            case 'section':
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Select Class</label>
                            <select
                                required
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.class_id || ''}
                                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                            >
                                <option value="">Select a class</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Section Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Section A"
                            />
                        </div>
                    </>
                );
            case 'subject':
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Subject Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Mathematics"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Subject Code</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.code || ''}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="e.g. MATH101"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold" style={{ color: '#3D52A0' }}>Type</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl outline-none transition-all"
                                style={{ border: '1px solid #ADBBDA' }}
                                value={formData.type || 'theory'}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="theory">Theory</option>
                                <option value="practical">Practical</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div style={{ backgroundColor: '#EDE8F5', borderBottomColor: '#ADBBDA' }} className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold" style={{ color: '#3D52A0' }}>
                        {data ? 'Edit' : 'Add New'} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ADBBDA'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                        <X className="w-5 h-5" style={{ color: '#8697C4' }} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {renderFields()}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-white rounded-xl transition-colors font-semibold flex items-center justify-center hover:opacity-90"
                            style={{ backgroundColor: '#3D52A0' }}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {data ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcademicForm;
