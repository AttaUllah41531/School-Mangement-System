import React from 'react';
import Layout from '../components/layout/Layout';
import { ClipboardList } from 'lucide-react';

const Exams = () => {
    return (
        <Layout>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Exams</h1>
                <p className="text-gray-500">Manage examinations, results, and grade sheets.</p>
            </div>

            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="bg-indigo-50 p-6 rounded-full mb-6">
                    <ClipboardList className="w-16 h-16 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Exams & Grading Module</h2>
                <p className="text-gray-500 max-w-md">
                    The examination management module is in the works. 
                    You'll be able to schedule exams and publish results here soon.
                </p>
            </div>
        </Layout>
    );
};

export default Exams;
