'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Loader2, CheckCircle, ChevronRight, ChevronLeft, User, Home, FileText, Award,
  Upload, AlertCircle, Info, CreditCard
} from 'lucide-react';

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Contact & Address', icon: Home },
  { label: 'Documents', icon: FileText },
  { label: 'Chess IDs & Password', icon: Award },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [taluks, setTaluks] = useState<{ id: string; name: string; code?: string }[]>([]);

  // Taluk code to pincode mapping for Kallakurichi district
  const talukPincodeMap: Record<string, string> = {
    'KKI': '606202',
    'CHI': '606201',
    'SAN': '606401',
    'ULP': '606107',
    'TKR': '605757',
    'KVH': '606303',
  };
  const [loginEnabled, setLoginEnabled] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const birthCertRef = useRef<HTMLInputElement>(null);
  const aadhaarRef = useRef<HTMLInputElement>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [birthCertFile, setBirthCertFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    gender: '', dateOfBirth: '',
    // Contact & Address
    guardianName: '', guardianRelation: '',
    addressLine1: '', state: 'Tamil Nadu', district: 'Kallakurichi',
    talukId: '', pincode: '',
    // Chess IDs
    fideId: '', aicfId: '', tncaId: '',
    // Password
    password: '', confirmPassword: '',
  });

  useEffect(() => {
    api.get('/public/taluks').then((res) => {
      setTaluks(res.data?.data || res.data || []);
    }).catch(() => {});
    // Check if login/password is enabled
    api.get('/public/settings').then((res) => {
      const settings = res.data?.data || res.data || {};
      // Public endpoint returns { key: value } object
      const val = Array.isArray(settings)
        ? settings.find((s: any) => s.key === 'registration_login_enabled')?.value
        : settings.registration_login_enabled;
      setLoginEnabled(val === true || val === 'true');
    }).catch(() => {});
  }, []);

  const updateField = (key: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-fill pincode when taluk is selected
      if (key === 'talukId' && value) {
        const selectedTaluk = taluks.find((t) => t.id === value);
        if (selectedTaluk?.code && talukPincodeMap[selectedTaluk.code]) {
          updated.pincode = talukPincodeMap[selectedTaluk.code];
        }
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (loginEnabled && form.password !== form.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!form.firstName || !form.email || !form.phone || !form.gender || !form.dateOfBirth) {
      setErrorMsg('Please fill all required fields (First Name, Email, Phone, Gender, Date of Birth)');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const { confirmPassword, ...payload } = form;
      const regRes = await api.post('/auth/register', {
        ...payload,
        role: 'PLAYER',
        password: loginEnabled ? payload.password : `KKdca@${Date.now()}`,
        gender: payload.gender || undefined,
        talukId: payload.talukId || undefined,
        guardianName: payload.guardianName || undefined,
        dateOfBirth: payload.dateOfBirth || undefined,
        fideId: payload.fideId || undefined,
        aicfId: payload.aicfId || undefined,
        tncaId: payload.tncaId || undefined,
      });

      // Initiate payment after registration
      const userId = regRes.data?.user?.id;
      if (userId) {
        try {
          const payRes = await api.post('/payments/registration', { userId });
          const paymentLink = payRes.data?.payment_links?.web;
          if (paymentLink) {
            window.location.href = paymentLink;
            return;
          }
        } catch (payErr: any) {
          // Payment initiation failed - still show success but note payment pending
          console.error('Payment initiation failed:', payErr);
        }
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      const msg = err.response?.data?.message;
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed.');
    }
  };

  const inputClass = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-sm';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-3">
            Your registration is complete. Please complete the membership payment to get your KKDCA ID.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-amber-800">Payment Pending</p>
                <p className="text-amber-700 mt-1">The payment page could not be loaded. Please contact KKDCA office to complete your membership payment of Rs.75.</p>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
          >
            Go to Home <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border">
        {/* Header */}
        <div className="p-6 pb-4 text-center border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <User className="w-7 h-7" />
            <h1 className="text-2xl font-bold">Player Registration</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Register as a Player with KKDCA (Kallakurichi District Chess Association)
          </p>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-5 border-b bg-gray-50">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {STEPS.map((s, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isDone ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-1.5 font-medium hidden sm:block ${
                      isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 md:w-16 h-0.5 mx-1 mt-[-18px] sm:mt-[-8px] ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pre-requirements notice */}
        {step === 1 && (
          <div className="mx-6 mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-800">Registration Requirements</p>
                <ul className="text-blue-700 mt-1 space-y-0.5">
                  <li>Photo, Birth Certificate, and Aadhaar are mandatory for verification</li>
                  <li>KKDCA Annual Membership Fee: <strong>Rs.75</strong> — payable during registration</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                    className={inputClass} placeholder="Enter first name" />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                    className={inputClass} placeholder="Enter last name" />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                    className={inputClass} placeholder="Enter email address" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                    className={inputClass} placeholder="Enter phone number" />
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)}
                    className={inputClass + ' bg-white'}>
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className={inputClass} />
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Contact & Address */}
          {step === 2 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
                Parent/Guardian & Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Parent/Guardian Name</label>
                  <input type="text" value={form.guardianName} onChange={(e) => updateField('guardianName', e.target.value)}
                    className={inputClass} placeholder="Enter parent/guardian name" />
                </div>
                <div>
                  <label className={labelClass}>Relationship</label>
                  <select value={form.guardianRelation} onChange={(e) => updateField('guardianRelation', e.target.value)}
                    className={inputClass + ' bg-white'}>
                    <option value="">Select relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <textarea value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)}
                  className={inputClass} rows={3} placeholder="Enter full address" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" value={form.state} readOnly
                    className={inputClass + ' bg-gray-100 text-gray-600 cursor-not-allowed'} />
                </div>
                <div>
                  <label className={labelClass}>District</label>
                  <input type="text" value={form.district} readOnly
                    className={inputClass + ' bg-gray-100 text-gray-600 cursor-not-allowed'} />
                </div>
                <div>
                  <label className={labelClass}>Taluk</label>
                  <select value={form.talukId} onChange={(e) => updateField('talukId', e.target.value)}
                    className={inputClass + ' bg-white'}>
                    <option value="">Select taluk</option>
                    {taluks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input type="text" value={form.pincode} onChange={(e) => updateField('pincode', e.target.value)}
                    className={inputClass} placeholder="Auto-filled by taluk" maxLength={6} />
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
                Upload Documents
              </h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800">Documents are required for verification</p>
                    <p className="text-blue-700">Upload your photo, birth certificate, and Aadhaar for verification. These can be updated later in your profile.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <DocUploadBox
                  label="Profile Photo"
                  hint="JPG, PNG. Max 3MB."
                  file={photoFile}
                  inputRef={photoRef}
                  accept="image/*"
                  onSelect={setPhotoFile}
                />
                <DocUploadBox
                  label="Birth Certificate"
                  hint="JPG, PNG, PDF. Max 3MB."
                  file={birthCertFile}
                  inputRef={birthCertRef}
                  accept="image/*,.pdf"
                  onSelect={setBirthCertFile}
                />
                <DocUploadBox
                  label="Aadhaar Card"
                  hint="JPG, PNG, PDF. Max 3MB."
                  file={aadhaarFile}
                  inputRef={aadhaarRef}
                  accept="image/*,.pdf"
                  onSelect={setAadhaarFile}
                />
              </div>
            </>
          )}

          {/* STEP 4: Chess IDs & Password */}
          {step === 4 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">
                Chess Federation IDs & Account Password
              </h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold text-amber-800">Membership Fee - Rs.75</p>
                    <p className="font-semibold text-amber-700">KKDCA Annual Membership Fee: Rs.75</p>
                    <p className="text-amber-600 mt-0.5">Valid from January 2026 to December 31, 2026. After completing the form, you will be redirected to the payment page. Upon successful payment, your registration will be submitted for admin review.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>FIDE ID <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={form.fideId} onChange={(e) => updateField('fideId', e.target.value)}
                    className={inputClass} placeholder="Enter FIDE ID" />
                </div>
                <div>
                  <label className={labelClass}>AICF ID <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={form.aicfId} onChange={(e) => updateField('aicfId', e.target.value)}
                    className={inputClass} placeholder="Enter AICF ID" />
                </div>
                <div>
                  <label className={labelClass}>TNSCA ID <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={form.tncaId} onChange={(e) => updateField('tncaId', e.target.value)}
                    className={inputClass} placeholder="Enter TNSCA ID" />
                </div>
              </div>

              {loginEnabled && (
                <>
                  <h4 className="text-base font-bold text-gray-900 text-center mt-4">Create Your Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Password</label>
                      <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)}
                        className={inputClass} placeholder="Enter password" />
                      <p className="text-xs text-gray-400 mt-1">Min 8 characters with uppercase, lowercase, and number</p>
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password</label>
                      <input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)}
                        className={inputClass} placeholder="Confirm password" />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-center gap-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!form.firstName || !form.email || !form.phone)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium transition-colors">
                {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {status === 'submitting' ? 'Processing...' : 'Pay & Register — ₹75'}
              </button>
            )}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function DocUploadBox({
  label, hint, file, inputRef, accept, onSelect,
}: {
  label: string; hint: string; file: File | null;
  inputRef: any; accept: string;
  onSelect: (f: File | null) => void;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition-colors">
      <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
      {file ? (
        <div className="space-y-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-xs text-green-700 font-medium truncate">{file.name}</p>
          <button onClick={() => { onSelect(null); if (inputRef.current) inputRef.current.value = ''; }}
            className="text-xs text-red-500 hover:underline">Remove</button>
        </div>
      ) : (
        <>
          <button onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> Upload {label}
          </button>
          <p className="text-xs text-gray-400 mt-2">{hint}</p>
        </>
      )}
      <input ref={inputRef} type="file" className="hidden" accept={accept}
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])} />
    </div>
  );
}
