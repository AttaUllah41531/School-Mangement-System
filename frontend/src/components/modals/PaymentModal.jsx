import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Smartphone, DollarSign, Wallet, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContextState';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

const PaymentModal = ({ isOpen, onClose, fee, onConfirm }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [method, setMethod] = useState('easypaisa');
    const [transactionId, setTransactionId] = useState('');
    const [receivedBy, setReceivedBy] = useState(user?.name || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user?.name && !receivedBy) {
            setReceivedBy(user.name);
        }
    }, [user, receivedBy]);

    if (!isOpen || !fee) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (method === 'easypaisa' || method === 'jazzcash' || method === 'bank') {
                if (!transactionId) {
                    alert('Please enter the Transaction Reference ID');
                    setIsSubmitting(false);
                    return;
                }

                const formData = new FormData();
                formData.append('fee_id', fee.id);
                formData.append('amount', fee.amount);
                formData.append('transaction_ref', transactionId);
                if (screenshot) {
                    formData.append('screenshot', screenshot);
                }

                const endpoint = method === 'bank' ? '/payments/bank-transfer/submit' : `/payments/${method}/submit`;
                
                await api.post(endpoint, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                onConfirm({ 
                    message: method === 'bank' 
                        ? 'Bank payment submitted for approval.' 
                        : `${method.charAt(0).toUpperCase() + method.slice(1)} payment submitted! Admin will verify your Transaction ID.` 
                });
            }

            if (method === 'cash') {
                await api.post('/payments/cash/submit', {
                    fee_id: fee.id,
                    amount: fee.amount,
                    received_by: receivedBy
                });
                onConfirm({ message: 'Cash payment recorded and invoice paid.' });
            }

            setScreenshot(null);
            setPreviewUrl(null);
            setTransactionId('');
            onClose();
        } catch (err) {
            console.error('Payment Error:', err);
            alert('Failed to process payment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const paymentMethods = [
        { id: 'easypaisa', name: 'Easypaisa', icon: Smartphone, color: '#16a34a', bg: '#f0fdf4' },
        { id: 'jazzcash', name: 'JazzCash', icon: Smartphone, color: '#dc2626', bg: '#fef2f2' },
        { id: 'bank', name: 'Bank Transfer', icon: CreditCard, color: '#2563eb', bg: '#eff6ff' },
        { id: 'cash', name: 'Cash', icon: Wallet, color: '#3D52A0', bg: '#EDE8F5' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div 
                    className="p-6 flex items-center justify-between text-white"
                    style={{ background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})` }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Confirm Payment</h2>
                            <p className="text-xs opacity-80 uppercase tracking-widest font-bold">INV #{fee.id.toString().padStart(4, '0')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                    {/* Amount info */}
                    <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Amount Due</span>
                        <span className="text-2xl font-black" style={{ color: P.primary }}>PKR {Number(fee.amount).toLocaleString()}</span>
                    </div>

                    {/* School Account Details */}
                    <div className="p-5 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">School Account Details</h4>
                        {method === 'easypaisa' && (
                            <div className="animate-in fade-in slide-in-from-left duration-300">
                                <p className="text-sm font-bold text-indigo-900">Easypaisa ID: <span className="text-indigo-600">0348-6632531</span></p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Title: Atta Ullah</p>
                            </div>
                        )}
                        {method === 'jazzcash' && (
                            <div className="animate-in fade-in slide-in-from-left duration-300">
                                <p className="text-sm font-bold text-indigo-900">JazzCash ID: <span className="text-indigo-600">0301-3241531</span></p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Title: Atta Ullah</p>
                            </div>
                        )}
                        {method === 'bank' && (
                            <div className="animate-in fade-in slide-in-from-left duration-300">
                                <p className="text-sm font-bold text-indigo-900">Bank AL Habib: <span className="text-indigo-600">2059004800017805</span></p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Title: Atta Ullah | Branch: Main</p>
                            </div>
                        )}
                        {method === 'cash' && (
                            <div className="animate-in fade-in slide-in-from-left duration-300">
                                <p className="text-sm font-bold text-indigo-900">Visit Admin Office</p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Office Hours: 9:00 AM - 2:00 PM</p>
                            </div>
                        )}
                    </div>

                    {/* Method Toggle */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Select Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setMethod(m.id)}
                                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                                        method === m.id ? `border-[${m.color}] ring-2 ring-[${m.color}]/10` : 'border-gray-50 bg-white hover:border-gray-100'
                                    }`}
                                    style={{ 
                                        borderColor: method === m.id ? m.color : '',
                                        backgroundColor: method === m.id ? m.bg : ''
                                    }}
                                >
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: method === m.id ? 'white' : m.bg }}>
                                        <m.icon className="w-4 h-4" style={{ color: m.color }} />
                                    </div>
                                    <span className={`text-xs font-bold ${method === m.id ? 'text-gray-900' : 'text-gray-500'}`}>{m.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Context Inputs */}
                    {(method === 'bank' || method === 'easypaisa' || method === 'jazzcash') && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Transaction Ref ID</label>
                                <input
                                    required
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder={`Enter ${method} transaction reference`}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none text-sm font-bold text-indigo-900"
                                />
                            </div>
                            
                            {/* Screenshot Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Proof of Payment (Screenshot)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors cursor-pointer min-h-[100px]"
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <ImageIcon className="w-6 h-6 text-gray-300" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Click to upload screenshot</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {method === 'cash' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Received By (Staff Name)</label>
                            <input
                                required
                                type="text"
                                value={receivedBy}
                                onChange={(e) => setReceivedBy(e.target.value)}
                                placeholder="Enter staff name"
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none text-sm font-bold text-indigo-900"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        style={{ backgroundColor: P.primary, boxShadow: `0 10px 25px ${P.primary}44` }}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                {method === 'cash' ? 'Record Payment' : 'Confirm Payment'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
