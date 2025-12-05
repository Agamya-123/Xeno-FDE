'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Save, Globe, Key, Bell } from 'lucide-react';

export default function Settings() {
  const [tenantId, setTenantId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenantId');
    if (!storedTenantId) {
      router.push('/login');
    } else {
      setTenantId(storedTenantId);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your store configuration and preferences.</p>
        </header>

        <div className="space-y-6 max-w-4xl">
          {/* General Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">General Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                <input type="text" defaultValue="My Awesome Store" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shopify Domain</label>
                <input type="text" defaultValue="test-store.myshopify.com" disabled className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none" />
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Key size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">API Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Token</label>
                <div className="flex gap-2">
                  <input type="password" value="shpat_xxxxxxxxxxxxxxxx" readOnly className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none font-mono" />
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">Reveal</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Webhook Secret</label>
                <input type="password" value="whsec_xxxxxxxxxxxxxxxx" readOnly className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none font-mono" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Bell size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Alerts</p>
                  <p className="text-sm text-slate-500">Receive daily summaries via email.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
