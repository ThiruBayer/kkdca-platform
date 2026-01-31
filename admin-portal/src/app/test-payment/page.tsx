'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestPaymentPage() {
  const [form, setForm] = useState({ firstName: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePay = async () => {
    if (!form.firstName || !form.email || !form.phone) {
      setErrorMsg('Please fill all fields');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');

    try {
      // Auto-append timestamp to email/phone to avoid duplicate errors
      const ts = Date.now();
      const [emailUser, emailDomain] = form.email.split('@');
      const uniqueEmail = `${emailUser}+${ts}@${emailDomain}`;
      const uniquePhone = `${form.phone.slice(0, 6)}${String(ts).slice(-4)}`;

      const regRes = await api.post('/auth/register', {
        firstName: form.firstName,
        lastName: 'Test',
        email: uniqueEmail,
        phone: uniquePhone,
        role: 'ARBITER',
        password: `Test@${ts}`,
        gender: 'MALE',
      });

      const userId = regRes.data?.user?.id;
      if (!userId) {
        setErrorMsg('Registration succeeded but no user ID returned');
        setStatus('error');
        return;
      }

      // Initiate payment
      const payRes = await api.post('/payments/registration', { userId });
      const paymentLink = payRes.data?.payment_links?.web;
      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      setErrorMsg('Payment session created but no redirect URL received. Check server logs.');
      setStatus('error');
    } catch (err: any) {
      setStatus('error');
      const msg = err.response?.data?.message;
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed. Check server logs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <div className="p-6 text-center border-b border-gray-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold mb-3">
            TEST MODE — Rs 10
          </div>
          <h1 className="text-xl font-bold text-white">HDFC Payment Gateway Test</h1>
          <p className="text-gray-400 text-sm mt-1">Quick test — no validation on duplicate email/phone</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="9876543210"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={status === 'submitting'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold transition-colors text-lg"
          >
            {status === 'submitting' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <><CreditCard className="w-5 h-5" /> Pay ₹10 — Test HDFC Gateway</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
