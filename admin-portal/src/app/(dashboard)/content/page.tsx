'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Megaphone,
  Newspaper,
  Image,
  Loader2,
} from 'lucide-react';

const contentTypes = [
  { value: '', label: 'All Types' },
  { value: 'NEWS', label: 'News' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'PAGE', label: 'Page' },
  { value: 'BANNER', label: 'Banner' },
  { value: 'TESTIMONIAL', label: 'Testimonial' },
  { value: 'ACHIEVEMENT', label: 'Achievement' },
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-green-100 text-green-700' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-red-100 text-red-700' },
];

const typeIcons: Record<string, any> = {
  NEWS: Newspaper,
  ANNOUNCEMENT: Megaphone,
  PAGE: FileText,
  BANNER: Image,
  TESTIMONIAL: FileText,
  ACHIEVEMENT: FileText,
};

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  body?: string;
  excerpt?: string;
  isPinned: boolean;
  showOnHome: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  author?: { id: string; firstName: string; lastName: string };
}

export default function ContentPage() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [form, setForm] = useState({
    title: '',
    type: 'NEWS' as string,
    body: '',
    excerpt: '',
    status: 'DRAFT' as string,
    isPinned: false,
    showOnHome: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['content', filterType, page],
    queryFn: async () => {
      const params: any = { page, limit: 20 };
      if (filterType) params.type = filterType;
      const res = await api.get('/content', { params });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/content', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/content/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ title: '', type: 'NEWS', body: '', excerpt: '', status: 'DRAFT', isPinned: false, showOnHome: false });
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({ title: '', type: 'NEWS', body: '', excerpt: '', status: 'DRAFT', isPinned: false, showOnHome: false });
    setShowModal(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      type: item.type,
      body: item.body || '',
      excerpt: item.excerpt || '',
      status: item.status,
      isPinned: item.isPinned,
      showOnHome: item.showOnHome,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteMutation.mutate(id);
    }
  };

  const items: ContentItem[] = data?.data || [];
  const pagination = data?.pagination;

  const getStatusBadge = (status: string) => {
    const opt = statusOptions.find((s) => s.value === status);
    return opt ? (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${opt.color}`}>{opt.label}</span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage news, announcements, and pages</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg bg-white text-sm"
        >
          {contentTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading content...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No content found. Create your first content item.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const Icon = typeIcons[item.type] || FileText;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          {item.isPinned && <span className="text-xs text-orange-600">Pinned</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.viewCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-red-50 rounded" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">{editingItem ? 'Edit Content' : 'Create Content'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Content title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                  >
                    {contentTypes.filter((t) => t.value).map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                  >
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  rows={8}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Content body..."
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Pin to top</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.showOnHome}
                    onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  <span className="text-sm text-gray-700">Show on homepage</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending || !form.title}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
