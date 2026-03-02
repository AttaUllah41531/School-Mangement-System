import React from 'react';
import Layout from '../components/layout/Layout';
import { BookMarked } from 'lucide-react';

const Library = () => {
    return (
        <Layout>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Library</h1>
                <p className="text-gray-500">Manage books, issuing, and library inventory.</p>
            </div>

            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="bg-amber-50 p-6 rounded-full mb-6">
                    <BookMarked className="w-16 h-16 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Library System Coming Soon</h2>
                <p className="text-gray-500 max-w-md">
                    We're building a comprehensive library management system. 
                    Book catalogs and lending tracking will be available here.
                </p>
            </div>
        </Layout>
    );
};

export default Library;
