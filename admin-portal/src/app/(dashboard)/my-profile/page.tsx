'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { User, Save, Loader2, CheckCircle, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

export default function MyProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
    bloodGroup: '',
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    // Guardian
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelation: '',
    // Chess IDs
    fideId: '',
    aicfId: '',
    tncaId: '',
    // Education
    occupation: '',
    schoolName: '',
    collegeName: '',
    // Bio
    bio: '',
  });

  // Document state
  const [documents, setDocuments] = useState<{
    photo: { url: string | null; uploading: boolean };
    aadhaar: { url: string | null; uploading: boolean };
    birthCert: { url: string | null; uploading: boolean };
  }>({
    photo: { url: null, uploading: false },
    aadhaar: { url: null, uploading: false },
    birthCert: { url: null, uploading: false },
  });

  const photoRef = useRef<HTMLInputElement>(null);
  const aadhaarRef = useRef<HTMLInputElement>(null);
  const birthCertRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      const p = profile.profile;
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        dateOfBirth: p?.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
        gender: p?.gender || '',
        bloodGroup: p?.bloodGroup || '',
        addressLine1: p?.addressLine1 || '',
        addressLine2: p?.addressLine2 || '',
        city: p?.city || '',
        district: p?.district || '',
        state: p?.state || 'Tamil Nadu',
        pincode: p?.pincode || '',
        guardianName: p?.guardianName || '',
        guardianPhone: p?.guardianPhone || '',
        guardianEmail: p?.guardianEmail || '',
        guardianRelation: p?.guardianRelation || '',
        fideId: p?.fideId || '',
        aicfId: p?.aicfId || '',
        tncaId: p?.tncaId || '',
        occupation: p?.occupation || '',
        schoolName: p?.schoolName || '',
        collegeName: p?.collegeName || '',
        bio: p?.bio || '',
      });
      setDocuments({
        photo: { url: p?.photoUrl || null, uploading: false },
        aadhaar: { url: p?.aadhaarUrl || null, uploading: false },
        birthCert: { url: p?.birthCertUrl || null, uploading: false },
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.patch('/users/me', data),
    onSuccess: () => {
      setSaveStatus('saved');
      setErrorMsg('');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: (err: any) => {
      setSaveStatus('error');
      const msg = err.response?.data?.message;
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg || 'Save failed');
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

  const handleFileUpload = async (
    file: File,
    docType: 'photo' | 'aadhaar' | 'birthCert',
    purpose: string,
  ) => {
    if (!profile?.id) return;

    setDocuments((prev) => ({ ...prev, [docType]: { ...prev[docType], uploading: true } }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'user');
      formData.append('entityId', profile.id);
      formData.append('purpose', purpose);

      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileUrl = res.data?.fileUrl || res.data?.data?.fileUrl;
      setDocuments((prev) => ({ ...prev, [docType]: { url: fileUrl, uploading: false } }));
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    } catch {
      setDocuments((prev) => ({ ...prev, [docType]: { ...prev[docType], uploading: false } }));
    }
  };

  const inputClass = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-6 space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, j) => <div key={j} className="h-10 bg-gray-200 rounded"></div>)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Update your personal information and documents</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
        >
          {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> :
           saveStatus === 'saved' ? <CheckCircle className="w-4 h-4" /> :
           <Save className="w-4 h-4" />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Profile'}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errorMsg}</div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {documents.photo.url ? (
              <img src={documents.photo.url} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-primary-200" />
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-600" />
              </div>
            )}
            <button
              onClick={() => photoRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input ref={photoRef} type="file" className="hidden" accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'photo', 'PROFILE_PHOTO')} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {profile?.kdcaId && (
                <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                  KDCA ID: {profile.kdcaId}
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                user?.status === 'ACTIVE' ? 'bg-green-50 text-green-700' :
                user?.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {user?.status || 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date of Birth *</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gender *</label>
            <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)} className={inputClass + ' bg-white'}>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Blood Group</label>
            <select value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} className={inputClass + ' bg-white'}>
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Address Line 1</label>
            <input type="text" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} className={inputClass} placeholder="Door No, Street" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address Line 2</label>
            <input type="text" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} className={inputClass} placeholder="Area, Landmark" />
          </div>
          <div>
            <label className={labelClass}>City / Town</label>
            <input type="text" value={form.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>District</label>
            <input type="text" value={form.district} onChange={(e) => updateField('district', e.target.value)} className={inputClass} placeholder="Kallakurichi" />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input type="text" value={form.state} onChange={(e) => updateField('state', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pincode</label>
            <input type="text" value={form.pincode} onChange={(e) => updateField('pincode', e.target.value)} className={inputClass} maxLength={6} placeholder="606202" />
          </div>
        </div>
      </div>

      {/* Guardian Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Details</h3>
        <p className="text-sm text-gray-500 mb-4">Required for players under 18 years of age</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Guardian Name</label>
            <input type="text" value={form.guardianName} onChange={(e) => updateField('guardianName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Relation</label>
            <select value={form.guardianRelation} onChange={(e) => updateField('guardianRelation', e.target.value)} className={inputClass + ' bg-white'}>
              <option value="">Select</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Uncle">Uncle</option>
              <option value="Aunt">Aunt</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Guardian Phone</label>
            <input type="tel" value={form.guardianPhone} onChange={(e) => updateField('guardianPhone', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Guardian Email</label>
            <input type="email" value={form.guardianEmail} onChange={(e) => updateField('guardianEmail', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Chess IDs & Ratings */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chess IDs & Ratings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>FIDE ID</label>
            <input type="text" value={form.fideId} onChange={(e) => updateField('fideId', e.target.value)} className={inputClass} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass}>AICF ID</label>
            <input type="text" value={form.aicfId} onChange={(e) => updateField('aicfId', e.target.value)} className={inputClass} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass}>TNCA ID</label>
            <input type="text" value={form.tncaId} onChange={(e) => updateField('tncaId', e.target.value)} className={inputClass} placeholder="Optional" />
          </div>
        </div>
        {profile?.profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">FIDE Standard</p>
              <p className="text-lg font-bold text-gray-900">{profile.profile.fideRatingStd || '-'}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">FIDE Rapid</p>
              <p className="text-lg font-bold text-gray-900">{profile.profile.fideRatingRapid || '-'}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">FIDE Blitz</p>
              <p className="text-lg font-bold text-gray-900">{profile.profile.fideRatingBlitz || '-'}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">AICF Rating</p>
              <p className="text-lg font-bold text-gray-900">{profile.profile.aicfRating || '-'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Education & Occupation */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Occupation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Occupation</label>
            <input type="text" value={form.occupation} onChange={(e) => updateField('occupation', e.target.value)} className={inputClass} placeholder="Student / Professional / etc." />
          </div>
          <div>
            <label className={labelClass}>School Name</label>
            <input type="text" value={form.schoolName} onChange={(e) => updateField('schoolName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>College Name</label>
            <input type="text" value={form.collegeName} onChange={(e) => updateField('collegeName', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
        <textarea
          value={form.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={4}
          className={inputClass}
          placeholder="Write a brief bio about your chess journey..."
        />
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
        <p className="text-sm text-gray-500 mb-4">Upload required documents (JPEG, PNG or PDF, max 5MB each)</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo */}
          <DocumentUpload
            label="Passport Photo"
            url={documents.photo.url}
            uploading={documents.photo.uploading}
            inputRef={photoRef}
            accept="image/*"
            onUpload={(file) => handleFileUpload(file, 'photo', 'PROFILE_PHOTO')}
            isImage
          />

          {/* Aadhaar */}
          <DocumentUpload
            label="Aadhaar Card"
            url={documents.aadhaar.url}
            uploading={documents.aadhaar.uploading}
            inputRef={aadhaarRef}
            accept="image/*,.pdf"
            onUpload={(file) => handleFileUpload(file, 'aadhaar', 'AADHAAR')}
          />

          {/* Birth Certificate */}
          <DocumentUpload
            label="Birth Certificate"
            url={documents.birthCert.url}
            uploading={documents.birthCert.uploading}
            inputRef={birthCertRef}
            accept="image/*,.pdf"
            onUpload={(file) => handleFileUpload(file, 'birthCert', 'BIRTH_CERTIFICATE')}
          />
        </div>
      </div>
    </div>
  );
}

function DocumentUpload({
  label,
  url,
  uploading,
  inputRef,
  accept,
  onUpload,
  isImage,
}: {
  label: string;
  url: string | null;
  uploading: boolean;
  inputRef: any;
  accept: string;
  onUpload: (file: File) => void;
  isImage?: boolean;
}) {
  return (
    <div className="border-2 border-dashed rounded-lg p-4 text-center">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
      {uploading ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-xs text-gray-500">Uploading...</p>
        </div>
      ) : url ? (
        <div className="space-y-2">
          {isImage ? (
            <img src={url} alt={label} className="w-24 h-24 rounded-lg object-cover mx-auto border" />
          ) : (
            <div className="flex items-center justify-center gap-2 py-4">
              <FileText className="w-8 h-8 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Uploaded</span>
            </div>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs text-primary-600 hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-2 py-4 w-full hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-500">Click to upload</span>
          <span className="text-xs text-gray-400">JPG, PNG or PDF</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
}
