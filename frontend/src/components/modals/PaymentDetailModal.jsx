import React, { useState } from 'react';
import { X, Calendar, Hash, CreditCard, User, CheckCircle2, AlertCircle, Clock, ExternalLink, DollarSign, Image as ImageIcon, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContextState';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    soft: '#EDE8F5',
};

const PaymentDetailModal = ({ isOpen, onClose, payment }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [isVerifying, setIsVerifying] = useState(false);

    if (!isOpen || !payment) return null;

    const StatusBadge = ({ status }) => {
        const config = {
            success: { bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle2, label: 'Success' },
            pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock, label: 'Pending' },
            failed: { bg: 'bg-red-50', text: 'text-red-600', icon: AlertCircle, label: 'Failed' }
        };
        const { bg, text, icon: Icon, label } = config[status] || config.pending;

        return (
            <div className={`${bg} ${text} px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest`}>
                <Icon className="w-3 h-3" />
                {label}
            </div>
        );
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            await api.post(`/payments/verify/${payment.id}`);
            alert('Payment verified successfully!');
            onClose();
            window.location.reload(); 
        } catch (err) {
            console.error('Verification failed:', err);
            alert('Failed to verify payment.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 pb-0 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black mb-1" style={{ color: P.primary }}>Payment Detail</h2>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Transaction Record</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Status & Method */}
                    <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                <CreditCard className="w-6 h-6" style={{ color: P.primary }} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Method</p>
                                <p className="font-black text-gray-800 uppercase tracking-wider">{payment.method}</p>
                            </div>
                        </div>
                        <StatusBadge status={payment.status} />
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Hash className="w-3 h-3" /> Transaction ID
                            </p>
                            <p className="font-black text-gray-800 truncate" title={payment.transaction_ref}>
                                {payment.transaction_ref}
                            </p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 justify-end">
                                <DollarSign className="w-3 h-3" /> Amount Paid
                            </p>
                            <p className="font-black text-2xl" style={{ color: P.primary }}>
                                PKR {Number(payment.amount).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Date
                            </p>
                            <p className="font-bold text-gray-700">
                                {new Date(payment.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </p>
                        </div>
                        {payment.received_by && (
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 justify-end">
                                    <User className="w-3 h-3" /> Received By
                                </p>
                                <p className="font-bold text-gray-700">{payment.received_by}</p>
                            </div>
                        )}
                    </div>

                    {/* Screenshot Preview */}
                    {payment.screenshot_url && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> Proof of Payment
                            </p>
                            <div className="relative group rounded-3xl overflow-hidden border-4 border-gray-50 shadow-sm aspect-video bg-gray-100">
                                <img 
                                    src={`http://localhost:5000${payment.screenshot_url}`} 
                                    alt="Payment Screenshot" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <a 
                                    href={`http://localhost:5000${payment.screenshot_url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white flex items-center gap-2 font-bold text-sm">
                                        <ExternalLink className="w-5 h-5" />
                                        View Full Image
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {payment.status === 'pending' && isAdmin && (
                            <button 
                                onClick={handleVerify}
                                disabled={isVerifying}
                                className="w-full py-5 bg-green-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-green-700 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2"
                            >
                                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                Verify & Mark as Paid
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                        >
                            Close Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailModal;
