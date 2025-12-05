'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Sparkles, TrendingUp, Users, AlertTriangle, Zap } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Insights() {
    const [tenantId, setTenantId] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        if (!storedTenantId) {
            router.push('/login');
        } else {
            setTenantId(storedTenantId);
        }
    }, [router]);

    useEffect(() => {
        if (tenantId) {
            fetchInsights();
        }
    }, [tenantId]);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await axios.get(`${API_URL}/api/insights/${tenantId}`);
            setData(res.data);
        } catch (error) {
            console.error('Failed to fetch insights', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = data ? [
        { name: 'VIP', value: data.segments.vip, color: '#6366f1' },
        { name: 'Loyal', value: data.segments.loyal, color: '#8b5cf6' },
        { name: 'New', value: data.segments.new, color: '#10b981' },
        { name: 'At Risk', value: data.segments.atRisk, color: '#f59e0b' },
    ] : [];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-indigo-600 w-6 h-6" />
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Insights</h1>
                    </div>
                    <p className="text-slate-500">Smart segmentation and actionable recommendations for your store.</p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-slate-400">Analyzing data...</div>
                ) : data ? (
                    <div className="space-y-8">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-indigo-600">
                                    <Users className="w-5 h-5" />
                                    <h3 className="font-semibold">Total Customers</h3>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{data.metrics.totalCustomers}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-emerald-600">
                                    <TrendingUp className="w-5 h-5" />
                                    <h3 className="font-semibold">Avg. LTV</h3>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">${data.metrics.avgLTV}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-amber-500">
                                    <AlertTriangle className="w-5 h-5" />
                                    <h3 className="font-semibold">At Risk</h3>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{data.segments.atRisk}</p>
                                <p className="text-xs text-slate-400 mt-1">No orders in 30 days</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-violet-600">
                                    <Zap className="w-5 h-5" />
                                    <h3 className="font-semibold">VIPs</h3>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{data.segments.vip}</p>
                                <p className="text-xs text-slate-400 mt-1">Spent &gt; $500</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Customer Segmentation</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-lg text-white">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                    AI Recommendations
                                </h3>
                                <div className="space-y-6">
                                    {data.recommendations.map((rec: any, i: number) => (
                                        <div key={i} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                            <h4 className="font-semibold text-indigo-200 mb-1">{rec.title}</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{rec.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">No insights available.</div>
                )}
            </main>
        </div>
    );
}
