import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import { 
    Users, 
    UserCheck, 
    DollarSign,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Calendar,
    Activity
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const StatCard = (props) => {
    const { title, value, icon: Icon, trendValue, isUp, bgColor, iconColor } = props;
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 group transition-all duration-300"
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px rgba(61,82,160,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
        >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: bgColor || '#EDE8F5' }}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: iconColor || '#3D52A0' }} />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
            <h3 className="text-xs sm:text-sm font-medium mb-1 truncate" style={{ color: '#8697C4' }}>{title}</h3>
            <div className="flex items-end space-x-1 sm:space-x-2">
                <p className="text-xl sm:text-3xl font-extrabold" style={{ color: '#3D52A0' }}>{value}</p>
                <div className={`flex items-center space-x-0.5 text-xs sm:text-sm font-bold pb-0.5 sm:pb-1 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span>{trendValue}</span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#7091E6' }} />
                        <p className="font-medium" style={{ color: '#8697C4' }}>Loading Statistics...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const isStudent = stats?.role === 'student';

    const cards = isStudent ? [
        { title: 'Pending Dues', value: `PKR ${Number(stats?.pendingFees || 0).toLocaleString()}`, icon: DollarSign, bgColor: '#fef2f2', iconColor: '#dc2626', trendValue: 'Required', isUp: false },
        { title: 'Attendance Rate', value: stats?.attendanceRate || '0%', icon: Calendar, bgColor: '#f0fdf4', iconColor: '#16a34a', trendValue: 'Stable', isUp: true },
        { title: 'Upcoming Exams', value: stats?.upcomingExams || 0, icon: Activity, bgColor: '#eff6ff', iconColor: '#2563eb', trendValue: 'Next Month', isUp: true },
        { title: 'Library Books', value: stats?.libraryBooks || 0, icon: Users, bgColor: '#f5f3ff', iconColor: '#7c3aed', trendValue: 'Active', isUp: true },
    ] : [
        { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, bgColor: '#EDE8F5', iconColor: '#3D52A0', trendValue: '+12%', isUp: true },
        { title: 'Total Teachers', value: stats?.totalTeachers || 0, icon: UserCheck, bgColor: '#EDE8F5', iconColor: '#7091E6', trendValue: '+4%', isUp: true },
        { title: 'Attendance Rate', value: stats?.dailyAttendance || '0%', icon: Calendar, bgColor: '#EDE8F5', iconColor: '#8697C4', trendValue: '-2%', isUp: false },
        { title: 'Total Revenue', value: stats?.totalRevenue ? `PKR ${stats.totalRevenue.toLocaleString()}` : 'PKR 0', icon: DollarSign, bgColor: '#EDE8F5', iconColor: '#3D52A0', trendValue: '+18%', isUp: true },
    ];

    return (
        <Layout>
            <div className="mb-6 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: '#3D52A0' }}>
                    {isStudent ? 'My Dashboard' : 'School Dashboard'}
                </h1>
                <p className="text-sm" style={{ color: '#8697C4' }}>
                    {isStudent ? 'Track your performance and dues.' : "Welcome back! Here's what's happening today."}
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
                {cards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── Enrollment/Performance Trends ── */}
                <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#3D52A0' }}>
                                {isStudent ? 'My Performance' : 'Enrollment Trends'}
                            </h3>
                            <p className="text-sm" style={{ color: '#8697C4' }}>
                                {isStudent ? 'Monthly progress' : 'Monthly student admissions'}
                            </p>
                        </div>
                        {isStudent ? null : (
                            <select
                                style={{ backgroundColor: '#EDE8F5', color: '#3D52A0' }}
                                className="border-none rounded-lg px-3 py-2 text-sm font-medium outline-none shrink-0"
                            >
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        )}
                    </div>
                    <div className="h-[220px] sm:h-[280px] lg:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={isStudent ? stats?.performanceTrends || [] : stats?.enrollmentTrends || []} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#7091E6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#7091E6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8F5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ADBBDA', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#ADBBDA', fontSize: 11}} width={35} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #EDE8F5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: 13 }}
                                />
                                <Area type="monotone" dataKey={isStudent ? "value" : "students"} stroke="#7091E6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Attendance Analysis ── */}
                <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#3D52A0' }}>Attendance Analysis</h3>
                            <p className="text-sm" style={{ color: '#8697C4' }}>
                                {isStudent ? 'Weekly attendance' : 'Average attendance by month'}
                            </p>
                        </div>
                        <Activity className="w-5 h-5 mt-1 shrink-0" style={{ color: '#ADBBDA' }} />
                    </div>
                    <div className="h-[220px] sm:h-[280px] lg:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.attendanceTrend || []} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8F5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ADBBDA', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#ADBBDA', fontSize: 11}} width={35} />
                                <Tooltip
                                    cursor={{ fill: '#EDE8F5' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #EDE8F5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: 13 }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                    {stats?.attendanceTrend?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value === 100 ? '#3D52A0' : '#ADBBDA'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Dashboard;
