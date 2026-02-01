'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface IdUpdateRequest {
  id: string;
  tncaId: string | null;
  aicfId: string | null;
  fideId: string | null;
  status: string;
  adminRemarks: string | null;
  createdAt: string;
  user: {
    kdcaId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    phone: string;
    profile?: {
      fideId: string | null;
      aicfId: string | null;
      tncaId: string | null;
    } | null;
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function IdUpdatesPage() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['id-update-requests', statusFilter],
    queryFn: async () => {
      const res = await api.get('/admin/id-update-requests', {
        params: { status: statusFilter || undefined },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await api.post(`/admin/id-update-requests/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['id-update-requests'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, remarks }: { requestId: string; remarks: string }) => {
      await api.post(`/admin/id-update-requests/${requestId}/reject`, { remarks }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['id-update-requests'] });
      setRejectId(null);
      setRemarks('');
    },
  });

  const requests: IdUpdateRequest[] = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ID Update Requests</h1>
          <p className="text-gray-500 text-sm">Review and approve player ID update requests</p>
        </div>
        <div className="flex gap-2">
          {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                statusFilter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No {statusFilter.toLowerCase() || ''} requests found
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {req.user.firstName} {req.user.lastName || ''}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {req.user.kdcaId} · {req.user.email} · {req.user.phone}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[req.status] || 'bg-gray-100'}`}>
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                {/* Current IDs */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-400 mb-1">Current IDs</p>
                  <p className="text-sm">TNSCA: <span className="font-mono">{req.user.profile?.tncaId || '—'}</span></p>
                  <p className="text-sm">AICF: <span className="font-mono">{req.user.profile?.aicfId || '—'}</span></p>
                  <p className="text-sm">FIDE: <span className="font-mono">{req.user.profile?.fideId || '—'}</span></p>
                </div>
                {/* Requested IDs */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-500 mb-1">Requested Update</p>
                  {req.tncaId && <p className="text-sm">TNSCA: <span className="font-mono font-semibold">{req.tncaId}</span></p>}
                  {req.aicfId && <p className="text-sm">AICF: <span className="font-mono font-semibold">{req.aicfId}</span></p>}
                  {req.fideId && (
                    <p className="text-sm">
                      FIDE: <span className="font-mono font-semibold">{req.fideId}</span>
                      <a
                        href={`https://ratings.fide.com/profile/${req.fideId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center ml-1 text-blue-500 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  )}
                  {!req.tncaId && !req.aicfId && !req.fideId && <p className="text-sm text-gray-400">None</p>}
                </div>
                {/* Date */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-400 mb-1">Submitted</p>
                  <p className="text-sm">{new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  {req.adminRemarks && (
                    <>
                      <p className="text-xs font-medium text-gray-400 mt-2 mb-1">Admin Remarks</p>
                      <p className="text-sm text-red-600">{req.adminRemarks}</p>
                    </>
                  )}
                </div>
              </div>

              {req.status === 'PENDING' && (
                <div className="flex gap-2 pt-2 border-t">
                  {rejectId === req.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button
                        onClick={() => rejectMutation.mutate({ requestId: req.id, remarks })}
                        disabled={rejectMutation.isPending}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => { setRejectId(null); setRemarks(''); }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => approveMutation.mutate(req.id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectId(req.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
