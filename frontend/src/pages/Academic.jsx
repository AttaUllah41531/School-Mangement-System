import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import AcademicForm from '../components/forms/AcademicForm';
import { 
    GraduationCap, 
    Plus, 
    Edit2, 
    Trash2, 
    Layers, 
    BookOpen,
    Loader2
} from 'lucide-react';

const Academic = () => {
    const [activeTab, setActiveTab] = useState('classes');
    const [data, setData] = useState([]);
    const [classes, setClasses] = useState([]); // Specifically for section dropdown
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/academic/${activeTab}`);
            setData(res.data);
            
            if (activeTab === 'sections' || activeTab === 'classes') {
                const classRes = await api.get('/academic/classes');
                setClasses(classRes.data);
            }
        } catch (err) {
            console.error('Error fetching academic data', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (formData) => {
        try {
            if (selectedItem) {
                await api.put(`/academic/${activeTab}/${selectedItem.id}`, formData);
            } else {
                await api.post(`/academic/${activeTab}`, formData);
            }
            fetchData();
        } catch (err) {
            console.error('Action failed', err);
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/academic/${activeTab}/${id}`);
                fetchData();
            } catch (err) {
                console.error('Delete failed', err);
            }
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedItem(null);
        setIsFormOpen(true);
    };

    const tabs = [
        { id: 'classes', name: 'Classes', icon: GraduationCap },
        { id: 'sections', name: 'Sections', icon: Layers },
        { id: 'subjects', name: 'Subjects', icon: BookOpen },
    ];

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#3D52A0' }}>Academic Setup</h1>
                    <p style={{ color: '#8697C4' }}>Manage your school's classes, sections, and curriculum.</p>
                </div>
                <button 
                    onClick={handleAdd}
                    style={{ backgroundColor: '#3D52A0', boxShadow: '0 8px 20px rgba(61,82,160,0.3)' }}
                    className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl transition-all font-semibold hover:opacity-90"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add {activeTab.slice(0, -1)}</span>
                </button>
            </div>

            {/* Tabs */}
            <div style={{ backgroundColor: '#EDE8F5' }} className="flex space-x-1 p-1 rounded-2xl mb-8 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                        style={activeTab === tab.id
                            ? { backgroundColor: '#fff', color: '#3D52A0', boxShadow: '0 2px 8px rgba(61,82,160,0.15)' }
                            : { color: '#8697C4' }
                        }
                        onMouseEnter={(e) => {
                            if (activeTab !== tab.id) e.currentTarget.style.color = '#3D52A0';
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== tab.id) e.currentTarget.style.color = '#8697C4';
                        }}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ backgroundColor: '#EDE8F5', color: '#8697C4' }} className="text-sm uppercase tracking-wider font-semibold">
                                {activeTab === 'classes' && (
                                    <>
                                        <th className="px-8 py-5">Class Name</th>
                                        <th className="px-6 py-5">Description</th>
                                    </>
                                )}
                                {activeTab === 'sections' && (
                                    <>
                                        <th className="px-8 py-5">Section Name</th>
                                        <th className="px-6 py-5">Class</th>
                                    </>
                                )}
                                {activeTab === 'subjects' && (
                                    <>
                                        <th className="px-8 py-5">Subject</th>
                                        <th className="px-6 py-5">Code</th>
                                        <th className="px-6 py-5">Type</th>
                                    </>
                                )}
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-5"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-8 py-5 text-right"><div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center" style={{ color: '#8697C4' }}>
                                        No {activeTab} found. Click 'Add' to create one.
                                    </td>
                                </tr>
                            ) : data.map((item) => (
                                <tr key={item.id} className="transition-colors group"
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8F5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                >
                                    <td className="px-8 py-5 font-bold" style={{ color: '#3D52A0' }}>
                                        {item.name}
                                    </td>
                                    {activeTab === 'classes' && (
                                        <td className="px-6 py-5 text-gray-600">{item.description || 'No description'}</td>
                                    )}
                                    {activeTab === 'sections' && (
                                        <td className="px-6 py-5 text-gray-600">{item.class_name}</td>
                                    )}
                                    {activeTab === 'subjects' && (
                                        <>
                                            <td className="px-6 py-5 text-gray-600">{item.code}</td>
                                            <td className="px-6 py-5">
                                                <span style={{ backgroundColor: '#EDE8F5', color: '#7091E6' }} className="px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                    {item.type}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end items-center space-x-2">
                                            <button 
                                                onClick={() => handleEdit(item)}
                                                className="p-2 rounded-lg transition-all text-gray-400"
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDE8F5'; e.currentTarget.style.color = '#3D52A0'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AcademicForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                type={activeTab === 'classes' ? 'class' : activeTab === 'sections' ? 'section' : 'subject'}
                data={selectedItem}
                classes={classes}
            />
        </Layout>
    );
};

export default Academic;
