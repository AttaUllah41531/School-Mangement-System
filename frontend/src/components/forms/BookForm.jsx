import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Book, User, Hash, Tag, Layers, MapPin } from 'lucide-react';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

const BookForm = ({ isOpen, onClose, book, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (book) {
            reset(book);
        } else {
            reset({
                title: '',
                author: '',
                isbn: '',
                category: '',
                quantity: 1,
                publisher: '',
                rack_number: '',
            });
        }
    }, [book, reset, isOpen]);

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
                            <Book className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{book ? 'Edit Book Details' : 'Add New Book'}</h2>
                            <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Library Management</p>
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
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                Book Title
                            </label>
                            <div className="relative">
                                <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    placeholder="e.g., Fundamentals of Physics"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                    style={{ backgroundColor: P.soft, color: P.primary }}
                                />
                            </div>
                            {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>}
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                Author
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                <input
                                    {...register('author', { required: 'Author is required' })}
                                    placeholder="e.g., Robert Resnick"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                    style={{ backgroundColor: P.soft, color: P.primary }}
                                />
                            </div>
                            {errors.author && <p className="text-red-500 text-xs mt-1 ml-1">{errors.author.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* ISBN */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    ISBN
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        {...register('isbn')}
                                        placeholder="ISBN"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Category
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        {...register('category')}
                                        placeholder="Science"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Quantity */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Total Quantity
                                </label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        type="number"
                                        {...register('quantity', { required: true, min: 1 })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                            </div>

                            {/* Rack Number */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                    Rack / Shelf
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                                    <input
                                        {...register('rack_number')}
                                        placeholder="A-12"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                        style={{ backgroundColor: P.soft, color: P.primary }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Publisher */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: P.muted }}>
                                Publisher
                            </label>
                            <input
                                {...register('publisher')}
                                placeholder="Publisher Name"
                                className="w-full px-4 py-3 rounded-xl border-none outline-none text-sm font-medium transition-all"
                                style={{ backgroundColor: P.soft, color: P.primary }}
                            />
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
                            {isSubmitting ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
