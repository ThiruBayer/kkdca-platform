'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CheckCircle, XCircle, Clock, Loader2, Home } from 'lucide-react';

type PaymentState = 'loading' | 'success' | 'failed' | 'pending' | 'error';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PaymentState>('loading');
  const [payment, setPayment] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');
    const signature = searchParams.get('signature');

    if (!orderId) {
      setState('error');
      setErrorMsg('No order ID found in URL');
      return;
    }

    // First, notify backend about the return (POST callback with query params)
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Call backend to verify and process payment
    const verifyPayment = async () => {
      try {
        // Send callback data to backend
        if (signature) {
          await api.post('/payments/callback', params).catch(() => {});
        }

        // Verify payment status via server-to-server call
        const res = await api.get(`/payments/verify/${orderId}`);
        const data = res.data;
        setPayment(data);

        if (data.status === 'SUCCESS') {
          setState('success');
        } else if (data.status === 'FAILED') {
          setState('failed');
        } else {
          setState('pending');
        }
      } catch (err: any) {
        setState('error');
        setErrorMsg(err.response?.data?.message || 'Failed to verify payment status');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const statusConfig = {
    loading: {
      icon: <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />,
      title: 'Verifying Payment...',
      desc: 'Please wait while we confirm your payment status.',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    success: {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: 'Payment Successful!',
      desc: 'Your KKDCA membership has been activated. You will receive a confirmation email shortly.',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    failed: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Payment Failed',
      desc: 'Your payment could not be processed. Please try again or contact KKDCA office.',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    pending: {
      icon: <Clock className="w-16 h-16 text-amber-500" />,
      title: 'Payment Pending',
      desc: 'Your payment is being processed. This may take a few minutes. Please do not close this page.',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    error: {
      icon: <XCircle className="w-16 h-16 text-gray-400" />,
      title: 'Error',
      desc: errorMsg || 'Something went wrong.',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    },
  };

  const config = statusConfig[state];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className={`${config.bg} border ${config.border} rounded-2xl shadow-xl p-10 max-w-md w-full text-center`}>
        <div className="flex justify-center mb-6">{config.icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.desc}</p>

        {payment && (
          <div className="bg-white rounded-xl p-4 mb-6 text-left text-sm space-y-2 border">
            {payment.gatewayOrderId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-medium">{payment.gatewayOrderId}</span>
              </div>
            )}
            {payment.amount && (
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold">Rs. {payment.amount}</span>
              </div>
            )}
            {payment.receiptNo && (
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt No</span>
                <span className="font-mono">{payment.receiptNo}</span>
              </div>
            )}
          </div>
        )}

        {state === 'pending' && (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium mb-4"
          >
            Refresh Status
          </button>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
        >
          <Home className="w-4 h-4" /> Go to Home
        </Link>
      </div>
    </div>
  );
}
