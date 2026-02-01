'use client';

import { useState } from 'react';
import { Search, User, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kallaichess.com/v1';

interface PlayerInfo {
  id: string;
  kdcaId: string;
  firstName: string;
  lastName: string | null;
  role: string;
  taluk?: { name: string; code: string } | null;
  profile?: {
    fideId?: string | null;
    aicfId?: string | null;
    tncaId?: string | null;
    fideRatingStd?: number | null;
    fideRatingRapid?: number | null;
    fideRatingBlitz?: number | null;
    aicfRating?: number | null;
  } | null;
}

interface FideInfo {
  name: string;
  title: string;
  federation: string;
  ratingStd: string;
  ratingRapid: string;
  ratingBlitz: string;
  birthYear: string;
}

export default function UpdateIdPage() {
  const [kdcaId, setKdcaId] = useState('');
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Update form
  const [tncaId, setTncaId] = useState('');
  const [aicfId, setAicfId] = useState('');
  const [fideId, setFideId] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMsg, setSubmitMsg] = useState('');

  // FIDE lookup
  const [fideInfo, setFideInfo] = useState<FideInfo | null>(null);
  const [fideLookupLoading, setFideLookupLoading] = useState(false);

  const searchPlayer = async () => {
    if (!kdcaId.trim()) return;
    setSearchStatus('loading');
    setPlayer(null);
    setErrorMsg('');
    setSubmitStatus('idle');
    setSubmitMsg('');
    setFideInfo(null);

    try {
      const res = await fetch(`${API_URL}/public/player-lookup/${kdcaId.trim().toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setPlayer(data);
        setSearchStatus('found');
        // Pre-fill existing IDs
        setTncaId(data.profile?.tncaId || '');
        setAicfId(data.profile?.aicfId || '');
        setFideId(data.profile?.fideId || '');
      } else if (res.status === 404) {
        setSearchStatus('not_found');
        setErrorMsg('No player found with this KKDCA ID');
      } else {
        setSearchStatus('error');
        setErrorMsg('Failed to search. Please try again.');
      }
    } catch {
      setSearchStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const lookupFide = async () => {
    const id = fideId.trim();
    if (!id) return;
    setFideLookupLoading(true);
    setFideInfo(null);

    try {
      const res = await fetch(`https://ratings.fide.com/profile/${id}`);
      if (res.ok) {
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const getText = (selector: string) => {
          const el = doc.querySelector(selector);
          return el?.textContent?.trim() || '';
        };

        // Parse FIDE profile page
        const profileCards = doc.querySelectorAll('.profile-top-info__block__row__data');
        const name = doc.querySelector('.profile-top-title')?.textContent?.trim() || '';
        const title = profileCards[0]?.textContent?.trim() || '';
        const federation = profileCards[1]?.textContent?.trim() || '';
        const birthYear = profileCards[3]?.textContent?.trim() || '';

        // Ratings
        const ratingEls = doc.querySelectorAll('.profile-top-rating-data');
        const ratingStd = ratingEls[0]?.textContent?.trim() || 'Unrated';
        const ratingRapid = ratingEls[1]?.textContent?.trim() || 'Unrated';
        const ratingBlitz = ratingEls[2]?.textContent?.trim() || 'Unrated';

        if (name) {
          setFideInfo({ name, title, federation, ratingStd, ratingRapid, ratingBlitz, birthYear });
        } else {
          setFideInfo(null);
        }
      }
    } catch {
      // CORS may block direct fetch - show link instead
      setFideInfo(null);
    }
    setFideLookupLoading(false);
  };

  const submitRequest = async () => {
    if (!tncaId.trim() && !aicfId.trim() && !fideId.trim()) {
      setSubmitStatus('error');
      setSubmitMsg('Please enter at least one ID to update');
      return;
    }

    setSubmitStatus('loading');
    setSubmitMsg('');

    try {
      const res = await fetch(`${API_URL}/public/id-update-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kdcaId: player?.kdcaId,
          tncaId: tncaId.trim() || undefined,
          aicfId: aicfId.trim() || undefined,
          fideId: fideId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setSubmitMsg(data.message || 'Request submitted successfully!');
      } else {
        setSubmitStatus('error');
        setSubmitMsg(data.message || 'Failed to submit request');
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Update Player ID</h1>
          <p className="text-primary-100 text-lg">
            Update your TNSCA, AICF, or FIDE ID by submitting a request
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter your KKDCA Player ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={kdcaId}
              onChange={(e) => setKdcaId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && searchPlayer()}
              placeholder="e.g. KKI-P-001"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-mono"
            />
            <button
              onClick={searchPlayer}
              disabled={searchStatus === 'loading' || !kdcaId.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {searchStatus === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </button>
          </div>

          {searchStatus === 'not_found' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}
          {searchStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}
        </div>

        {/* Player Info Card */}
        {player && searchStatus === 'found' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {player.firstName} {player.lastName || ''}
                </h2>
                <p className="text-sm text-gray-500">
                  {player.kdcaId} · {player.role} {player.taluk ? `· ${player.taluk.name}` : ''}
                </p>
              </div>
            </div>

            {/* Current IDs */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Current IDs</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">TNSCA ID</span>
                  <span className="font-mono font-medium">{player.profile?.tncaId || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">AICF ID</span>
                  <span className="font-mono font-medium">{player.profile?.aicfId || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">FIDE ID</span>
                  <span className="font-mono font-medium">{player.profile?.fideId || '—'}</span>
                </div>
              </div>
              {(player.profile?.fideRatingStd || player.profile?.aicfRating) && (
                <div className="grid grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t border-gray-200">
                  <div>
                    <span className="text-gray-400 block">FIDE Std</span>
                    <span className="font-medium">{player.profile?.fideRatingStd || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">FIDE Rapid</span>
                    <span className="font-medium">{player.profile?.fideRatingRapid || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">AICF Rating</span>
                    <span className="font-medium">{player.profile?.aicfRating || '—'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Update Form */}
            {submitStatus === 'success' ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <div>
                  <p className="font-semibold">Request Submitted!</p>
                  <p className="text-sm">{submitMsg}</p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Update IDs</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TNSCA ID</label>
                    <input
                      type="text"
                      value={tncaId}
                      onChange={(e) => setTncaId(e.target.value)}
                      placeholder="Enter TNSCA ID"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AICF ID</label>
                    <input
                      type="text"
                      value={aicfId}
                      onChange={(e) => setAicfId(e.target.value)}
                      placeholder="Enter AICF ID"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">FIDE ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={fideId}
                        onChange={(e) => setFideId(e.target.value)}
                        placeholder="e.g. 35000942"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        onClick={lookupFide}
                        disabled={!fideId.trim() || fideLookupLoading}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                      >
                        {fideLookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Lookup
                      </button>
                    </div>
                    {fideId.trim() && (
                      <a
                        href={`https://ratings.fide.com/profile/${fideId.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs text-primary-600 hover:underline"
                      >
                        View on FIDE Rating <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* FIDE Info Card */}
                  {fideInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">FIDE Profile Info</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-500 block text-xs">Name</span>
                          <span className="font-medium text-blue-900">{fideInfo.name}</span>
                        </div>
                        {fideInfo.title && (
                          <div>
                            <span className="text-blue-500 block text-xs">Title</span>
                            <span className="font-medium text-blue-900">{fideInfo.title}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-blue-500 block text-xs">Federation</span>
                          <span className="font-medium text-blue-900">{fideInfo.federation}</span>
                        </div>
                        {fideInfo.birthYear && (
                          <div>
                            <span className="text-blue-500 block text-xs">Birth Year</span>
                            <span className="font-medium text-blue-900">{fideInfo.birthYear}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-blue-500 block text-xs">Standard</span>
                          <span className="font-medium text-blue-900">{fideInfo.ratingStd}</span>
                        </div>
                        <div>
                          <span className="text-blue-500 block text-xs">Rapid</span>
                          <span className="font-medium text-blue-900">{fideInfo.ratingRapid}</span>
                        </div>
                        <div>
                          <span className="text-blue-500 block text-xs">Blitz</span>
                          <span className="font-medium text-blue-900">{fideInfo.ratingBlitz}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {submitMsg}
                    </div>
                  )}

                  <button
                    onClick={submitRequest}
                    disabled={submitStatus === 'loading'}
                    className="w-full py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    {submitStatus === 'loading' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : (
                      'Submit Update Request'
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Your request will be reviewed by KKDCA admin before updating.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
