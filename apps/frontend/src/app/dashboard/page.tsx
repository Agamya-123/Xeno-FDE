'use client';

import { useState, useEffect } from 'react';
import { ingestData, getDashboardData } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, RefreshCw, TrendingUp, ArrowUpRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [tenantId, setTenantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenantId');
    if (!storedTenantId) {
      router.push('/login');
    } else {
      setTenantId(storedTenantId);
    }
  }, [router]);

  const fetchData = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await getDashboardData(tenantId);
      setData(res);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    setLoading(true);
    try {
      await ingestData(tenantId);
      await fetchData();
    } catch (error) {
      console.error('Ingestion failed', error);
      alert('Ingestion failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchData();
    }
  }, [tenantId]);

  if (!tenantId) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 mt-1">Welcome back, here's what's happening with your store.</p>
          </div>

          <button
            onClick={handleIngest}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Sync Data'}
          </button>
        </header>

        {data ? (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${data.totalRevenue?.toLocaleString()}`}
                icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
                trend="+12.5%"
                trendUp={true}
                color="bg-emerald-50"
              />
              <StatCard
                title="Total Orders"
                value={data.totalOrders}
                icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
                trend="+8.2%"
                trendUp={true}
                color="bg-blue-50"
              />
              <StatCard
                title="Total Customers"
                value={data.totalCustomers}
                icon={<Users className="w-6 h-6 text-violet-600" />}
                trend="+2.4%"
                trendUp={true}
                color="bg-violet-50"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Revenue Trend</h3>
                  <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-100 transition-colors">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorOrders)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Top Customers</h3>
                <div className="space-y-4">
                  {data.topCustomers.map((c: any, i: number) => (
                    <div key={c.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-slate-100 text-slate-700' :
                              'bg-slate-50 text-slate-600'
                          }`}>
                          {c.firstName?.[0]}{c.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-slate-500">{c.ordersCount} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">${c.totalSpent}</p>
                        <p className="text-xs text-emerald-600 font-medium">High Value</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  View All Customers
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <RefreshCw className="w-8 h-8 text-slate-300" />
            </div>
            <p>Loading dashboard data...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
          {trendUp ? <ArrowUpRight size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
