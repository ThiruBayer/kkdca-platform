'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  type: string;
  description?: string;
  address: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  createdAt: string;
  taluk?: {
    name: string;
    code: string;
  };
  user?: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SUSPENDED: 'bg-gray-100 text-gray-700',
};

const typeLabels: Record<string, string> = {
  ACADEMY: 'Chess Academy',
  TALUK_ASSOCIATION: 'Taluk Association',
  SCHOOL: 'School',
  CLUB: 'Club',
};

export default function OrganizationsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-organizations', { search, type, status, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(type && { type }),
        ...(status && { status }),
      });
      const res = await api.get(`/organizations?${params}`);
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (orgId: string) => {
      return api.post(`/admin/organizations/${orgId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ orgId, reason }: { orgId: string; reason: string }) => {
      return api.post(`/admin/organizations/${orgId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
    },
  });

  const organizations: Organization[] = data?.data || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage academies, associations, and clubs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="ACADEMY">Academy</option>
            <option value="TALUK_ASSOCIATION">Taluk Association</option>
            <option value="SCHOOL">School</option>
            <option value="CLUB">Club</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Organizations Found</h3>
            <p className="text-gray-600">
              {search || type || status ? 'Try adjusting your filters' : 'Organizations will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {organizations.map((org) => (
              <div key={org.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[org.status]}`}>
                        {org.status}
                      </span>
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                        {typeLabels[org.type] || org.type}
                      </span>
                    </div>
                    {org.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{org.description}</p>
                    )}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{org.city}, {org.taluk?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{org.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{org.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(org.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {org.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => approveMutation.mutate(org.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) {
                              rejectMutation.mutate({ orgId: org.id, reason });
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="View Details"
                      onClick={() => router.push(`/organizations/${org.id}`)}
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.total)} of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
