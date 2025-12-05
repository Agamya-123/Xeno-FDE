'use client';

import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                    Xeno Insights
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>
                <Link href="/customers" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive('/customers') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <Users size={20} />
                    Customers
                </Link>
                <Link href="/orders" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive('/orders') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <ShoppingBag size={20} />
                    Orders
                </Link>
                <Link href="/insights" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive('/insights') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <Sparkles size={20} />
                    Insights
                </Link>
                <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive('/settings') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <Settings size={20} />
                    Settings
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-100">
                <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-600 w-full transition-colors">
                    <LogOut size={20} />
                    Sign Out
                </Link>
            </div>
        </aside>
    );
}
