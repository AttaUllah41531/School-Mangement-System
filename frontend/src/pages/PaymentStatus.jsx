import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ArrowRight,
    Home,
    Download,
    Receipt
} from 'lucide-react';

const P = {
    primary: '#3D52A0',
    secondary: '#7091E6',
    light: '#ADBBDA',
    soft: '#EDE8F5',
    muted: '#8697C4',
};

const PaymentStatus = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, failed, pending

    useEffect(() => {
        // In a real scenario, you'd check payment state via API here
        // For this demo, we simulate success after redirect back from callback
        const timer = setTimeout(() => {
            setStatus('success');
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const StatusView = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                            <Clock className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-400">Verifying Payment...</h2>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black mb-2" style={{ color: P.primary }}>Payment Successful!</h2>
                        <p className="text-gray-500 font-medium mb-8 max-w-xs">
                            Thank you! Your fee payment has been recorded and processed successfully.
                        </p>
                        
                        <div className="w-full bg-gray-50 rounded-3xl p-6 mb-8 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Transaction ID</span>
                                <span className="font-black text-gray-800">JC-482937X</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Amount Paid</span>
                                <span className="font-black" style={{ color: P.primary }}>PKR 1,200.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Payment Method</span>
                                <span className="font-black text-gray-800 uppercase tracking-widest">JazzCash</span>
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-3">
                            <button 
                                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                <Download className="w-4 h-4" />
                                Download Receipt
                            </button>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                                style={{ color: P.primary }}
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 text-red-600">Payment Failed</h2>
                        <p className="text-gray-500 font-medium mb-8 max-w-xs">
                            The transaction was declined by the bank or gateway. Please try again.
                        </p>
                        <button 
                            onClick={() => navigate('/fees')}
                            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest text-sm"
                        >
                            Back to Fees
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Layout>
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 w-full max-w-md">
                    <StatusView />
                </div>
            </div>
        </Layout>
    );
};

export default PaymentStatus;
