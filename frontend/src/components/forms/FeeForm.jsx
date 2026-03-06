import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContextState';
import { X, DollarSign, User, Calendar, CreditCard, ClipboardList } from 'lucide-react';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

const FeeForm = ({ isOpen, onClose, onSubmit }) => {
    const { user } = useAuth();
    const isStudent = user?.role === 'student';
    const [students, setStudents] = useState([]);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm();

    useEffect(() => {
        if (isOpen) {
            const fetchStudents = async () => {
                try {
                    // Only fetch all students if admin
                    if (!isStudent) {
                        const res = await api.get('/students');
                        setStudents(res.data);
                    }
                } catch (err) {
                    console.error('Error fetching students', err);
                }
            };
            fetchStudents();
            
            reset({
                student_id: isStudent ? user.student_id : '',
                amount: '',
                type: 'tuition',
                due_date: new Date().toISOString().split('T')[0],
            });
        }
    }, [isOpen, reset, isStudent, user]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div 
                    className="p-6 flex items-center justify-between text-white"
                    style={{ background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})` }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Generate Fee Invoice</h2>
                            <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Account & Finance</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-4">
                        {/* Student Select - Hidden for students */}
                        {!isStudent ? (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Student
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <select
                                        {...register('student_id', { required: 'Student is required' })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium appearance-none transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.student_id && <p className="text-red-500 text-xs mt-1 ml-1">{errors.student_id.message}</p>}
                            </div>
                        ) : (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                                <User className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Invoicing For</p>
                                    <p className="text-sm font-bold text-blue-800">{user.name}</p>
                                </div>
                                <input type="hidden" {...register('student_id')} value={user.student_id} />
                            </div>
                        )}

                        {/* Fee Type */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                Fee Category
                            </label>
                            <select
                                {...register('type', { required: 'Type is required' })}
                                className="w-full px-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                style={{ backgroundColor: P.soft, color: P.primary }}
                            >
                                <option value="tuition">Tuition Fee</option>
                                <option value="admission">Admission Fee</option>
                                <option value="exam">Examination Fee</option>
                                <option value="transport">Transport Fee</option>
                                <option value="library">Library Fee</option>
                                <option value="other">Other Fees</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Amount (PKR)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('amount', { required: 'Amount is required', min: 1 })}
                                        placeholder="0.00"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-xs mt-1 ml-1">{errors.amount.message}</p>}
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Due Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        type="date"
                                        {...register('due_date', { required: 'Due date is required' })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-bold transition-all active:scale-[0.98]"
                            style={{ backgroundColor: P.soft, color: P.primary }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                            style={{ backgroundColor: P.primary, boxShadow: `0 8px 20px ${P.primary}33` }}
                        >
                            {isSubmitting ? 'Generating...' : 'Create Invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeeForm;
