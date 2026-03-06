import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import FeeForm from '../components/forms/FeeForm';
import PaymentModal from '../components/modals/PaymentModal';
import PaymentDetailModal from '../components/modals/PaymentDetailModal';
import { useAuth } from '../context/AuthContextState';
import { 
    Plus, 
    DollarSign, 
    Search, 
    Edit2, 
    Trash2, 
    CheckCircle, 
    AlertCircle,
    Calendar,
    ArrowRightLeft,
    Clock,
    CreditCard,
    TrendingUp,
    Receipt,
    Wallet,
    Eye
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

const Fees = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [search, setSearch] = useState('');

    const fetchFees = async () => {
        setLoading(true);
        try {
            const res = await api.get('/fees');
            setFees(res.data);
        } catch (err) {
            console.error('Error fetching fees', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFees(); }, []);

    const handleSubmit = async (formData) => {
        try {
            await api.post('/fees', formData);
            setMessage({ type: 'success', text: 'Invoice generated successfully!' });
            setIsFormOpen(false);
            fetchFees();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Operation failed';
            setMessage({ type: 'error', text: errorMsg });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const handlePayClick = (fee) => {
        setSelectedFee(fee);
        setIsPaymentOpen(true);
    };

    const handleConfirmPayment = (response) => {
        setMessage({ type: 'success', text: response.message || 'Payment recorded successfully!' });
        setIsPaymentOpen(false);
        fetchFees();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleViewPayment = async (feeId) => {
        try {
            const response = await api.get(`/payments/fee/${feeId}`);
            setSelectedPayment(response.data);
            setIsDetailOpen(true);
        } catch {
            setMessage({ type: 'error', text: 'No payment details found for this fee' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this fee record?')) {
            try {
                await api.delete(`/fees/${id}`);
                fetchFees();
                setMessage({ type: 'success', text: 'Record deleted.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch {
                setMessage({ type: 'error', text: 'Failed to delete' });
            }
        }
    };

    const filteredFees = fees.filter(f => 
        (f.student_name?.toLowerCase() || '').includes(search.toLowerCase()) || 
        (f.admission_no?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (f.type?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const totalCollected = fees.reduce((acc, f) => acc + (f.status === 'paid' ? Number(f.amount) : 0), 0);
    const totalPending = fees.reduce((acc, f) => acc + (f.status === 'pending' ? Number(f.amount) : 0), 0);

    return (
        <Layout>
            <MessageDisplay message={message} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold" style={{ color: P.primary }}>Student Fees</h1>
                    <p className="text-sm font-medium" style={{ color: P.muted }}>Track payments, invoices and pending dues.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-[0.97] w-full sm:w-auto justify-center"
                    style={{ backgroundColor: P.primary, boxShadow: `0 8px 20px ${P.primary}33` }}
                >
                    <Plus className="w-5 h-5" />
                    New Invoice
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <StatCard icon={TrendingUp} label="Total Collected" value={`PKR ${totalCollected.toLocaleString()}`} color="#16a34a" />
                <StatCard icon={Wallet} label="Pending Dues" value={`PKR ${totalPending.toLocaleString()}`} color="#dc2626" />
                <StatCard icon={Receipt} label="Invoices" value={fees.length} color={P.primary} />
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: P.muted }} />
                <input
                    type="text"
                    placeholder="Search by student name or admission no..."
                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-none outline-none text-sm font-medium transition-all shadow-sm"
                    style={{ backgroundColor: P.soft, color: P.primary }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest font-extrabold" style={{ backgroundColor: P.soft, color: P.muted }}>
                                <th className="px-8 py-5">Student / Invoice</th>
                                <th className="px-8 py-5">Fee Category</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Due Date</th>
                                <th className="px-8 py-5">Payment Method</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6 h-20 bg-gray-50/50" />
                                    </tr>
                                ))
                            ) : filteredFees.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-gray-50">
                                                <DollarSign className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-400">No invoices found</h3>
                                            <p className="text-sm text-gray-400">Create a new fee invoice to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredFees.map(fee => (
                                    <tr key={fee.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl" style={{ backgroundColor: P.soft }}>
                                                    <CreditCard className="w-5 h-5" style={{ color: P.primary }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 leading-tight">{fee.student_name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">ADM: {fee.admission_no}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest" style={{ backgroundColor: P.soft, color: P.primary }}>
                                                {fee.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-extrabold text-[#3D52A0]">PKR {Number(fee.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-xs font-bold text-gray-500">{new Date(fee.due_date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${fee.payment_method ? 'text-gray-900' : 'text-gray-300'}`}>
                                                    {fee.payment_method || 'PENDING'}
                                                </span>
                                                {fee.transaction_id && (
                                                    <span className="text-[10px] font-bold text-gray-400 mt-0.5 truncate max-w-[100px] font-mono">
                                                        REF: {fee.transaction_id}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${fee.status === 'paid' ? 'bg-green-600' : 'bg-red-600'}`} />
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Hidden if payment_method exists to prevent double pay */}
                                                {fee.status === 'pending' && !fee.payment_method && (
                                                    <button 
                                                        onClick={() => handlePayClick(fee)}
                                                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-bold uppercase transition-all hover:bg-indigo-700 shadow-sm"
                                                    >
                                                        {isAdmin ? 'Record Payment' : 'Pay Now'}
                                                    </button>
                                                )}
                                                {(fee.status === 'paid' || (fee.payment_method && fee.payment_method !== 'PENDING')) && (
                                                    <button 
                                                        onClick={() => handleViewPayment(fee.id)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border flex items-center gap-1.5 ${
                                                            fee.status === 'paid' 
                                                                ? 'bg-gray-50 text-indigo-600 border-gray-100 hover:bg-indigo-50' 
                                                                : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                                                        }`}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {fee.status === 'paid' ? 'View Receipt' : (isAdmin ? 'Verify Proof' : 'View Submission')}
                                                    </button>
                                                )}
                                                {isAdmin && (
                                                    <button 
                                                        onClick={() => handleDelete(fee.id)}
                                                        className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FeeForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                fee={selectedFee}
                onConfirm={handleConfirmPayment}
            />
            <PaymentDetailModal 
                isOpen={isDetailOpen} 
                onClose={() => setIsDetailOpen(false)} 
                payment={selectedPayment} 
            />
        </Layout>
    );
};

export default Fees;
