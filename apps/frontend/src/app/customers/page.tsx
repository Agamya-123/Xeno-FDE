'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/Modal';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function Customers() {
    const [tenantId, setTenantId] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '' });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [minSpent, setMinSpent] = useState('');
    const router = useRouter();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

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
            fetchCustomers();
        }
    }, [tenantId, page, debouncedSearch, minSpent]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:4000/api/customers/${tenantId}?page=${page}&limit=10&search=${debouncedSearch}&minSpent=${minSpent}`);
            setCustomers(res.data.data);
            setTotalPages(res.data.meta.totalPages);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/customers', {
                tenantId,
                ...newCustomer
            });
            setIsModalOpen(false);
            setNewCustomer({ firstName: '', lastName: '', email: '' });
            fetchCustomers();
        } catch (error) {
            console.error('Failed to create customer', error);
            alert('Failed to create customer');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <div role="main" className="flex-1 md:ml-64 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
                        <p className="text-slate-500 mt-1">Manage and view your customer base.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                    >
                        Add Customer
                    </button>
                </header>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                            {showFilters && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-10">
                                    <label className="block text-xs font-medium text-slate-500 mb-2">Min Total Spent</label>
                                    <input
                                        type="number"
                                        value={minSpent}
                                        onChange={(e) => setMinSpent(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Orders</th>
                                    <th className="px-6 py-4">Total Spent</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading customers...</td></tr>
                                ) : customers.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No customers found.</td></tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(customer.id)}
                                                    className="hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                                                    title="Click to copy ID"
                                                >
                                                    {customer.id.slice(0, 8)}...
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                        {customer.firstName?.[0]}{customer.lastName?.[0]}
                                                    </div>
                                                    {customer.firstName} {customer.lastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{customer.email}</td>
                                            <td className="px-6 py-4 text-slate-500">{customer.ordersCount} orders</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">${customer.totalSpent}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer">
                <form onSubmit={handleCreateCustomer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input
                            required
                            type="text"
                            value={newCustomer.firstName}
                            onChange={e => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input
                            required
                            type="text"
                            value={newCustomer.lastName}
                            onChange={e => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            required
                            type="email"
                            value={newCustomer.email}
                            onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors mt-4"
                    >
                        Create Customer
                    </button>
                </form>
            </Modal>
        </div>
    );
}
