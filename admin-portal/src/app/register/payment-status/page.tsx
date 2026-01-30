'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CheckCircle, XCircle, Loader2, Clock, Info, ChevronRight } from 'lucide-react';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending' | 'error'>('loading');
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await api.get(`/payments/verify/${orderId}`);
        const data = res.data;
        setPayment(data);

        if (data.status === 'SUCCESS') {
          setStatus('success');
        } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    checkStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we verify your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-3">
              Your membership payment of ₹{payment?.amount || 75} has been received.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-green-800">Registration Complete!</p>
                  <ul className="text-green-700 mt-1 space-y-1">
                    <li>Your registration and payment have been submitted</li>
                    <li>Admin will review and approve your registration</li>
                    <li>Your KKDCA ID will be generated upon approval</li>
                  </ul>
                  {payment?.receiptNo && (
                    <p className="mt-2 text-green-800 font-medium">Receipt: {payment.receiptNo}</p>
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Go to Home <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">
              Your payment could not be processed. Your registration has been saved — you can retry payment later.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-700">
                  <p>Please contact the KKDCA office or try registering again. No duplicate account will be created if you use the same email/phone.</p>
                </div>
              </div>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Try Again <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h2>
            <p className="text-gray-600 mb-4">
              Your payment is being processed. This may take a few minutes.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-700">
                  <p>If the amount was debited from your account, your payment will be confirmed automatically. Please do not make another payment.</p>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Go to Home <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We could not verify your payment. Please contact the KKDCA office for assistance.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Go to Home <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
