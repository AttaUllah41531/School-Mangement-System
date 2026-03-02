import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContextState';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header
            style={{ borderBottomColor: '#EDE8F5' }}
            className="h-16 sm:h-20 bg-white border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 gap-3"
        >
            {/* ── Hamburger (mobile only) ── */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2.5 rounded-xl transition-colors shrink-0"
                style={{ backgroundColor: '#EDE8F5', color: '#8697C4' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ADBBDA'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EDE8F5'}
                aria-label="Toggle menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* ── Search bar ── */}
            <div className="flex-1 max-w-sm sm:max-w-md lg:max-w-xl">
                <div className="relative">
                    <Search
                        style={{ color: '#8697C4' }}
                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Search…"
                        style={{ backgroundColor: '#EDE8F5' }}
                        className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 border-none rounded-2xl outline-none text-sm transition-all"
                        onFocus={e => e.target.style.boxShadow = '0 0 0 2px #ADBBDA'}
                        onBlur={e  => e.target.style.boxShadow = 'none'}
                    />
                </div>
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                {/* Bell */}
                <button
                    style={{ backgroundColor: '#EDE8F5' }}
                    className="relative p-2.5 rounded-xl transition-colors"
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ADBBDA'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EDE8F5'}
                    aria-label="Notifications"
                >
                    <Bell style={{ color: '#8697C4' }} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* User info */}
                <div
                    style={{ borderLeftColor: '#EDE8F5' }}
                    className="flex items-center gap-3 pl-3 sm:pl-5 border-l"
                >
                    <div className="text-right hidden sm:block">
                        <p style={{ color: '#3D52A0' }} className="text-sm font-bold leading-tight">{user?.name}</p>
                        <p style={{ color: '#8697C4' }} className="text-xs capitalize">{user?.role}</p>
                    </div>
                    <div
                        style={{ background: 'linear-gradient(135deg, #3D52A0, #7091E6)', boxShadow: '0 4px 12px rgba(61,82,160,0.3)' }}
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0"
                    >
                        {user?.name?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
