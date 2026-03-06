import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, ClipboardList, BookOpen, Clock } from 'lucide-react';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

const ExamForm = ({ isOpen, onClose, exam, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (exam) {
            // Format dates for input type="date"
            const formattedExam = {
                ...exam,
                start_date: exam.start_date ? new Date(exam.start_date).toISOString().split('T')[0] : '',
                end_date: exam.end_date ? new Date(exam.end_date).toISOString().split('T')[0] : '',
            };
            reset(formattedExam);
        } else {
            reset({
                name: '',
                term: '',
                academic_year: new Date().getFullYear().toString(),
                start_date: '',
                end_date: '',
            });
        }
    }, [exam, reset, isOpen]);

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
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{exam ? 'Edit Examination' : 'Schedule New Exam'}</h2>
                            <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Exams & Grading</p>
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
                        {/* Exam Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                Exam Name
                            </label>
                            <div className="relative">
                                <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                <input
                                    {...register('name', { required: 'Exam name is required' })}
                                    placeholder="e.g., Final Examination 2026"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                    style={{ backgroundColor: P.soft, color: P.primary }}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Term */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Term / Semester
                                </label>
                                <select
                                    {...register('term', { required: 'Term is required' })}
                                    className="w-full px-4 py-3 rounded-xl border-none outline-none text-sm font-medium appearance-none transition-all"
                                    style={{ backgroundColor: P.soft, color: P.primary }}
                                >
                                    <option value="">Select Term</option>
                                    <option value="First Term">First Term</option>
                                    <option value="Mid Term">Mid Term</option>
                                    <option value="Final Term">Final Term</option>
                                    <option value="Practical">Practical</option>
                                </select>
                                {errors.term && <p className="text-red-500 text-xs mt-1 ml-1">{errors.term.message}</p>}
                            </div>

                            {/* Academic Year */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Academic Year
                                </label>
                                <input
                                    {...register('academic_year', { required: 'Year is required' })}
                                    placeholder="2026"
                                    className="w-full px-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                    style={{ backgroundColor: P.soft, color: P.primary }}
                                />
                                {errors.academic_year && <p className="text-red-500 text-xs mt-1 ml-1">{errors.academic_year.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        type="date"
                                        {...register('start_date', { required: 'Start date is required' })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                                {errors.start_date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.start_date.message}</p>}
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        type="date"
                                        {...register('end_date', { required: 'End date is required' })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                                {errors.end_date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.end_date.message}</p>}
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
                            {isSubmitting ? 'Saving...' : exam ? 'Update Exam' : 'Schedule Exam'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamForm;
