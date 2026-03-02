import React from 'react';
import Layout from '../components/layout/Layout';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <Layout>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-500">Manage application preferences and system configuration.</p>
            </div>

            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <SettingsIcon className="w-16 h-16 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
                <p className="text-gray-500 max-w-md">
                    Configure your school management system here. 
                    Profile management and general settings are coming soon.
                </p>
            </div>
        </Layout>
    );
};

export default Settings;
