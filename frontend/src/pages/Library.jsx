import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import BookForm from '../components/forms/BookForm';
import { 
    Plus, 
    Book, 
    Search, 
    Edit2, 
    Trash2, 
    CheckCircle, 
    AlertCircle,
    Bookmark,
    Layers,
    User,
    Tag,
    BookOpen,
    ArrowRightLeft,
    Clock
} from 'lucide-react';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

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

const Library = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [search, setSearch] = useState('');

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/library/books');
            setBooks(res.data);
        } catch (err) {
            console.error('Error fetching books', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleSubmit = async (formData) => {
        try {
            if (selectedBook) {
                await api.put(`/library/books/${selectedBook.id}`, formData);
                setMessage({ type: 'success', text: 'Book updated successfully!' });
            } else {
                await api.post('/library/books', formData);
                setMessage({ type: 'success', text: 'Book added successfully!' });
            }
            setIsFormOpen(false);
            fetchBooks();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Operation failed';
            setMessage({ type: 'error', text: errorMsg });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/library/books/${id}`);
                fetchBooks();
                setMessage({ type: 'success', text: 'Book removed from library.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch {
                setMessage({ type: 'error', text: 'Failed to delete book' });
            }
        }
    };

    const handleEdit = (book) => { setSelectedBook(book); setIsFormOpen(true); };
    const handleAdd = () => { setSelectedBook(null); setIsFormOpen(true); };

    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(search.toLowerCase()) || 
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn?.toLowerCase().includes(search.toLowerCase())
    );

    const totalAvailable = books.reduce((acc, book) => acc + (book.available_quantity || 0), 0);

    return (
        <Layout>
            <MessageDisplay message={message} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold" style={{ color: P.primary }}>Library Catalog</h1>
                    <p className="text-sm font-medium" style={{ color: P.muted }}>Inventory, book issuing and returns tracking.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleAdd}
                        className="flex-1 sm:flex-none flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-[0.97] justify-center"
                        style={{ backgroundColor: P.primary, boxShadow: `0 8px 20px ${P.primary}33` }}
                    >
                        <Plus className="w-5 h-5" />
                        Add Book
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <StatCard icon={Book} label="Unique Titles" value={books.length} color={P.primary} />
                <StatCard icon={Layers} label="Total Copies" value={books.reduce((acc, b) => acc + (b.quantity || 0), 0)} color="#16a34a" />
                <StatCard icon={CheckCircle} label="Available Now" value={totalAvailable} color="#ca8a04" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                    <input
                        type="text"
                        placeholder="Search books by title, author, or ISBN..."
                        className="w-full pl-11 pr-4 py-4 rounded-2xl border-none outline-none text-sm font-medium transition-all shadow-sm"
                        style={{ backgroundColor: P.soft, color: P.primary }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 md:flex-none flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-gray-100 font-bold transition-all hover:bg-gray-50 shadow-sm" style={{ color: P.primary }}>
                        <ArrowRightLeft className="w-4 h-4" />
                        Issues Tracking
                    </button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hidden lg:block">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] uppercase tracking-widest font-extrabold" style={{ backgroundColor: P.soft, color: P.muted }}>
                            <th className="px-8 py-5">Book Details</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5">Inventory</th>
                            <th className="px-8 py-5">Location</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="5" className="px-8 py-6 h-20 bg-gray-50/50" />
                                </tr>
                            ))
                        ) : filteredBooks.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-gray-50">
                                            <BookOpen className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-400">Library is empty</h3>
                                        <p className="text-sm text-gray-400">Add some books to the catalog.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredBooks.map(book => (
                                <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 rounded-lg flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: P.soft }}>
                                                <Bookmark className="w-6 h-6" style={{ color: P.primary }} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight mb-1">{book.title}</p>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">{book.author}</p>
                                                {book.isbn && <p className="text-[10px] text-gray-300 font-mono mt-1">{book.isbn}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest" style={{ backgroundColor: P.soft, color: P.primary }}>
                                            {book.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-extrabold text-gray-700">{book.available_quantity} / {book.quantity}</span>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500" 
                                                    style={{ 
                                                        width: `${(book.available_quantity / book.quantity) * 100}%`,
                                                        backgroundColor: book.available_quantity > 2 ? '#16a34a' : '#dc2626'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-gray-500">{book.rack_number || 'No Loc'}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(book)} className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(book.id)} className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden grid gap-4">
                {filteredBooks.map(book => (
                    <div key={book.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex gap-4">
                            <div className="w-16 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: P.soft }}>
                                <Book className="w-8 h-8" style={{ color: P.primary }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg leading-tight truncate" style={{ color: P.primary }}>{book.title}</h3>
                                <p className="text-sm font-semibold text-gray-400">{book.author}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase" style={{ backgroundColor: P.soft, color: P.primary }}>{book.category}</span>
                                    <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-bold uppercase">{book.rack_number}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest mb-1">Availability</p>
                                <p className="text-xl font-black" style={{ color: P.primary }}>{book.available_quantity} <span className="text-xs text-gray-300 font-bold">/ {book.quantity}</span></p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(book)} className="p-3 rounded-2xl bg-gray-50 text-gray-400"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(book.id)} className="p-3 rounded-2xl bg-gray-50 text-gray-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <BookForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                book={selectedBook}
                onSubmit={handleSubmit}
            />
        </Layout>
    );
};

export default Library;
