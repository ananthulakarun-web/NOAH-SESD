import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  KeyRound,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, changePassword, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    const res = await updateProfile({ username, email, title, bio });
    setProfileLoading(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile information updated successfully.' });
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill out all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setPasswordLoading(false);

    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Your password was changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message || 'Failed to change password.' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          <User className="w-3.5 h-3.5 text-purple-600" />
          Account & Security
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details, credentials, and authentication preferences.
        </p>
      </div>

      {/* Account Overview Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user?.username}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wide">
                {user?.role || 'user'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-[11px] text-slate-400 font-mono">
              Role: {user?.role === 'admin' ? 'Platform Administrator' : 'Job Applicant / Candidate'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form 1: Profile Information */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>

          {profileMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Display Name / Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Headline / Current Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your career focus..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white gradient-bg shadow-sm text-xs hover:brightness-105 transition-all"
            >
              <Save className="w-4 h-4" />
              {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Form 2: Change Password */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Security & Password</h3>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white gradient-bg shadow-sm text-xs hover:brightness-105 transition-all"
            >
              <Lock className="w-4 h-4" />
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400">
            Passwords are encrypted with bcrypt.js salt hashing before MongoDB persistence.
          </div>
        </div>
      </div>
    </div>
  );
}
