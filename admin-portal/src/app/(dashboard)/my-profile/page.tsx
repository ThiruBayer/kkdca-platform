'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { User, Save, Loader2, CheckCircle } from 'lucide-react';

export default function MyProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get('/users/me').then((res) => res.data?.data || res.data),
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    guardianName: '',
    guardianPhone: '',
    fideId: '',
    aicfId: '',
    tncaId: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender: profile.gender || '',
        guardianName: profile.playerProfile?.guardianName || '',
        guardianPhone: profile.playerProfile?.guardianPhone || '',
        fideId: profile.playerProfile?.fideId || '',
        aicfId: profile.playerProfile?.aicfId || '',
        tncaId: profile.playerProfile?.tncaId || '',
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.patch('/users/me', data),
    onSuccess: () => {
      setSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
  });

  const handleSave = () => {
    setSaveStatus('saving');
    mutation.mutate(form);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="bg-white rounded-lg border p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> :
           saveStatus === 'saved' ? <CheckCircle className="w-4 h-4" /> :
           <Save className="w-4 h-4" />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
        </button>
      </div>

      {/* Profile Picture & ID */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            {profile?.kdcaId && (
              <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded mt-1 inline-block">
                KDCA ID: {profile.kdcaId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guardian Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Details</h3>
        <p className="text-sm text-gray-500 mb-4">Required for players under 18 years</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
            <input type="text" value={form.guardianName} onChange={(e) => updateField('guardianName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
            <input type="tel" value={form.guardianPhone} onChange={(e) => updateField('guardianPhone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
      </div>

      {/* Chess IDs */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chess Ratings & IDs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">FIDE ID</label>
            <input type="text" value={form.fideId} onChange={(e) => updateField('fideId', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AICF ID</label>
            <input type="text" value={form.aicfId} onChange={(e) => updateField('aicfId', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TNCA ID</label>
            <input type="text" value={form.tncaId} onChange={(e) => updateField('tncaId', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Optional" />
          </div>
        </div>
      </div>
    </div>
  );
}
