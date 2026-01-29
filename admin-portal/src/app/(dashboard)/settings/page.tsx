'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Save, Settings, Globe, Mail, CreditCard, Bell, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    org_name: 'Kallakurichi District Chess Association',
    short_name: 'KKDCA',
    registration_year: '2024-25',
    allow_player_registration: true,
    allow_academy_registration: true,
    registration_login_enabled: false,
    site_title: 'KDCA - Kallakurichi District Chess Association',
    site_description: 'Official website of Kallakurichi District Chess Association - Promoting chess excellence in Kallakurichi',
    contact_email: 'info@kallaichess.com',
    contact_phone: '',
    address: 'Kallakurichi District, Tamil Nadu - 606202',
    default_membership_fee: '500',
    enable_online_payments: true,
    allow_offline_payments: true,
    email_from_name: 'KDCA',
    email_reply_to: 'info@kallaichess.com',
    notify_new_player: true,
    notify_new_academy: true,
    notify_tournament_approval: true,
    notify_payment_received: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await api.get('/admin/settings');
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      const settings = data.data as Array<{ key: string; value: any }>;
      const updates: Record<string, any> = {};
      settings.forEach((s) => {
        if (s.key in form) {
          updates[s.key] = s.value;
        }
      });
      if (Object.keys(updates).length > 0) {
        setForm((prev) => ({ ...prev, ...updates }));
      }
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (entries: { key: string; value: any }[]) => {
      await Promise.all(
        entries.map((e) => api.patch(`/admin/settings/${e.key}`, { value: e.value }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
  });

  const handleSave = () => {
    setSaveStatus('saving');
    const entries = Object.entries(form).map(([key, value]) => ({ key, value }));
    updateMutation.mutate(entries);
  };

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'site', label: 'Site Info', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage platform configuration</p>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading settings...</div>
          ) : (
            <>
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input type="text" value={form.org_name} onChange={(e) => updateField('org_name', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
                    <input type="text" value={form.short_name} onChange={(e) => updateField('short_name', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Year</label>
                    <input type="text" value={form.registration_year} onChange={(e) => updateField('registration_year', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.allow_player_registration} onChange={(e) => updateField('allow_player_registration', e.target.checked)} className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">Allow new player registrations</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.allow_academy_registration} onChange={(e) => updateField('allow_academy_registration', e.target.checked)} className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">Allow academy registrations</span>
                    </label>
                  </div>
                  <div className="pt-4 border-t">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.registration_login_enabled} onChange={(e) => updateField('registration_login_enabled', e.target.checked)} className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">Enable login credentials during registration</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">When disabled, players register without username/password. Admin can assign credentials later.</p>
                  </div>
                </div>
              )}

              {activeTab === 'site' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                    <input type="text" value={form.site_title} onChange={(e) => updateField('site_title', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea rows={3} value={form.site_description} onChange={(e) => updateField('site_description', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input type="email" value={form.contact_email} onChange={(e) => updateField('contact_email', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input type="tel" value={form.contact_phone} onChange={(e) => updateField('contact_phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea rows={2} value={form.address} onChange={(e) => updateField('address', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">Payment gateway integration is configured via environment variables. Contact administrator for changes.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Membership Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&#8377;</span>
                      <input type="number" value={form.default_membership_fee} onChange={(e) => updateField('default_membership_fee', e.target.value)} className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.enable_online_payments} onChange={(e) => updateField('enable_online_payments', e.target.checked)} className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">Enable online payments</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={form.allow_offline_payments} onChange={(e) => updateField('allow_offline_payments', e.target.checked)} className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">Allow offline payment verification</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">Email configuration is managed via environment variables. Contact administrator for SMTP settings.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                    <input type="text" value={form.email_from_name} onChange={(e) => updateField('email_from_name', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reply-To Email</label>
                    <input type="email" value={form.email_reply_to} onChange={(e) => updateField('email_reply_to', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 max-w-2xl">
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">New player registration</span>
                      <input type="checkbox" checked={form.notify_new_player} onChange={(e) => updateField('notify_new_player', e.target.checked)} className="rounded text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">New academy registration</span>
                      <input type="checkbox" checked={form.notify_new_academy} onChange={(e) => updateField('notify_new_academy', e.target.checked)} className="rounded text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Tournament approval requests</span>
                      <input type="checkbox" checked={form.notify_tournament_approval} onChange={(e) => updateField('notify_tournament_approval', e.target.checked)} className="rounded text-primary-600" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Payment received</span>
                      <input type="checkbox" checked={form.notify_payment_received} onChange={(e) => updateField('notify_payment_received', e.target.checked)} className="rounded text-primary-600" />
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                </button>
                {saveStatus === 'error' && (
                  <span className="text-sm text-red-600">Failed to save. Please try again.</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
