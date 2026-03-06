import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    BookOpen,
    Calendar,
    ClipboardList,
    BookMarked,
    Settings,
    LogOut,
    ChevronRight,
    GraduationCap,
    DollarSign,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContextState';

const Sidebar = ({ open, onClose }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Students',  icon: Users,           path: '/students'  },
        { name: 'Teachers',  icon: UserCheck,        path: '/teachers'  },
        { name: 'Academic',  icon: GraduationCap,   path: '/academic'  },
        { name: 'Attendance',icon: Calendar,         path: '/attendance'},
        { name: 'Exams',     icon: ClipboardList,    path: '/exams'     },
        { name: 'Library',   icon: BookMarked,       path: '/library'   },
        { name: 'Fees',      icon: DollarSign,       path: '/fees'      },
        { name: 'Settings',  icon: Settings,         path: '/settings'  },
    ];

    return (
        <aside
            style={{ backgroundColor: '#3D52A0' }}
            className={`
                fixed left-0 top-0 h-screen w-64 text-white flex flex-col shadow-2xl z-50
                transition-transform duration-300 ease-in-out
                ${open ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}
        >
            {/* Logo + mobile close */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div style={{ backgroundColor: '#7091E6' }} className="p-2 rounded-lg shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">EduMaster</h1>
                </div>
                {/* Close button — only visible on mobile */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}   /* close drawer on mobile after nav */
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3 rounded-xl
                            transition-all duration-200 group
                            ${isActive ? 'text-white shadow-lg' : 'hover:text-white'}
                        `}
                        style={({ isActive }) => isActive
                            ? { backgroundColor: '#7091E6', boxShadow: '0 4px 20px rgba(112,145,230,0.4)' }
                            : { color: '#ADBBDA' }
                        }
                        onMouseEnter={(e) => {
                            if (!e.currentTarget.getAttribute('aria-current')) {
                                e.currentTarget.style.backgroundColor = 'rgba(112,145,230,0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!e.currentTarget.getAttribute('aria-current')) {
                                e.currentTarget.style.backgroundColor = '';
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 transition-colors shrink-0" />
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                    </NavLink>
                ))}
            </nav>

            {/* User card + logout */}
            <div className="p-4">
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="rounded-2xl p-4 mb-3">
                    <div className="flex items-center space-x-3">
                        <div style={{ backgroundColor: '#7091E6' }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p style={{ color: '#ADBBDA' }} className="text-xs capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={{ color: '#ADBBDA' }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:text-white hover:bg-red-500/20 rounded-xl transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400 rotate-180" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
