import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save, Edit2, CheckCircle2, Eye, EyeOff, Lock, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { currentUser as defaultUser } from '@/data/users';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'api'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: defaultUser.name,
    email: 'ravi.kumar@honeychain.org',
    role: defaultUser.role,
    apiary: 'Royal Crest Apiaries (Uttar Pradesh)',
    location: defaultUser.location,
    tempUnit: 'Celsius (°C)',
    weightUnit: 'Kilograms (kg)',
    language: 'English (India)',
    emailAlerts: true,
    smsAlerts: true,
    weeklyReport: true,
    anomalyDetectionAlerts: true,
  });

  const handleSave = () => {
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  // ── Password change state ────────────────────────────────────────────────
  // SECURITY NOTE: This is a prototype UI only. No password is stored,
  // transmitted, or persisted anywhere — not in localStorage, sessionStorage,
  // source code, or any client-accessible variable. In a real deployment this
  // form would POST to a secure authenticated API endpoint over HTTPS.
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pw)) return 'Must include at least one uppercase letter.';
    if (!/[0-9]/.test(pw)) return 'Must include at least one number.';
    return null;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (!pwForm.current) { setPwError('Please enter your current password.'); return; }
    const validationError = validatePassword(pwForm.next);
    if (validationError) { setPwError(validationError); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    // Prototype: no real auth call — just show success feedback
    setPwSuccess(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => { setPwSuccess(false); setShowPwForm(false); }, 3000);
  };

  const closePwForm = () => {
    setShowPwForm(false);
    setPwForm({ current: '', next: '', confirm: '' });
    setPwError('');
    setPwSuccess(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-primary)] font-bold">Settings & Configuration</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage apiary identity, preferences, sensors, and telemetry alerts.</p>
        </div>
        {savedMessage && (
          <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg text-sm">
            <CheckCircle2 size={16} />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'preferences', icon: Globe, label: 'Preferences' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'api', icon: Shield, label: 'API & Nodes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-[var(--accent)] text-white shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
              }`}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <>
              <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Beekeeper Profile</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Your public credentials recorded on the Honey Chain network.</p>
                </div>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  {isEditing ? <Save size={15} /> : <Edit2 size={15} />}
                  <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </button>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-2xl font-serif font-bold shadow-md">
                  RK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{formData.name}</h3>
                  <p className="text-sm text-[var(--accent)] font-medium">{formData.role}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{formData.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-sm text-[var(--text-primary)] px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  ) : (
                    <div className="text-sm text-[var(--text-primary)] px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl">
                      {formData.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-sm text-[var(--text-primary)] px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  ) : (
                    <div className="text-sm text-[var(--text-primary)] px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl font-mono text-xs sm:text-sm">
                      {formData.email}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Apiary Name & Station
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.apiary} 
                      onChange={(e) => setFormData({ ...formData, apiary: e.target.value })}
                      className="w-full text-sm text-[var(--text-primary)] px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  ) : (
                    <div className="text-sm text-[var(--text-primary)] px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl">
                      {formData.apiary}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                  <span>Network Trust Rating: <strong className="text-[var(--accent)]">96/100 (Certified)</strong></span>
                  <span>Registered: March 2024</span>
                </div>
              </div>
            </section>

            {/* Security section — shown alongside profile tab */}
            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
              <div className="pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 mb-0.5">
                  <Lock size={16} className="text-[var(--accent)] shrink-0" />
                  <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Security</h2>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Manage your account password.</p>
              </div>

              {/* Password row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Password</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono tracking-widest">••••••••••••</p>
                </div>
                {!showPwForm && (
                  <button
                    onClick={() => setShowPwForm(true)}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all shrink-0"
                  >
                    <Edit2 size={14} />
                    Change Password
                  </button>
                )}
              </div>

              {/* Change password form */}
              {showPwForm && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4 pt-4 border-t border-[var(--border)]"
                  autoComplete="off"
                >
                  {/* Prototype notice */}
                  <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs flex items-start gap-2">
                    <Shield size={13} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[var(--text-secondary)]">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Prototype UI — </span>
                      No password is stored or transmitted. In a live deployment this would call a secure
                      authenticated API endpoint.
                    </p>
                  </div>

                  {/* Current password */}
                  {[
                    { key: 'current' as const, label: 'Current Password', auto: 'current-password' },
                    { key: 'next' as const,    label: 'New Password',     auto: 'new-password' },
                    { key: 'confirm' as const,  label: 'Confirm New Password', auto: 'new-password' },
                  ].map(({ key, label, auto }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPw[key] ? 'text' : 'password'}
                          value={pwForm[key]}
                          autoComplete={auto}
                          onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                          className="w-full text-sm text-[var(--text-primary)] px-3.5 py-2.5 pr-10 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          placeholder={key === 'current' ? 'Enter current password' : key === 'next' ? 'Min 8 chars, 1 uppercase, 1 number' : 'Re-enter new password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          aria-label={showPw[key] ? 'Hide password' : 'Show password'}
                        >
                          {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Validation requirements hint */}
                  <div className="text-[11px] text-[var(--text-secondary)] space-y-0.5">
                    <p>New password requirements:</p>
                    <ul className="list-disc list-inside pl-1 space-y-0.5">
                      <li className={pwForm.next.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>At least 8 characters</li>
                      <li className={/[A-Z]/.test(pwForm.next) ? 'text-green-600 dark:text-green-400' : ''}>At least one uppercase letter</li>
                      <li className={/[0-9]/.test(pwForm.next) ? 'text-green-600 dark:text-green-400' : ''}>At least one number</li>
                    </ul>
                  </div>

                  {/* Error message */}
                  {pwError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                      <X size={13} className="shrink-0" />
                      {pwError}
                    </div>
                  )}

                  {/* Success message */}
                  {pwSuccess && (
                    <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg">
                      <CheckCircle2 size={13} className="shrink-0" />
                      Password updated successfully. (Demo — no real change was made.)
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closePwForm}
                      className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </section>
          </>
        )}

          {/* Preferences Section */}
          {activeTab === 'preferences' && (
            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Interface & System Preferences</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Customize theme appearance and measurement units.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div>
                    <h4 className="font-medium text-sm text-[var(--text-primary)]">Theme Appearance</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Toggle between warm luxury light theme and dark theme.</p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                      Temperature Units
                    </label>
                    <div className="space-y-2">
                      {['Celsius (°C)', 'Fahrenheit (°F)'].map((unit) => (
                        <label key={unit} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] cursor-pointer text-sm">
                          <input 
                            type="radio" 
                            name="tempUnit" 
                            checked={formData.tempUnit === unit}
                            onChange={() => setFormData({ ...formData, tempUnit: unit })}
                            className="text-[var(--accent)]" 
                          />
                          <span className="text-[var(--text-primary)]">{unit}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                      Weight Units
                    </label>
                    <div className="space-y-2">
                      {['Kilograms (kg)', 'Pounds (lbs)'].map((unit) => (
                        <label key={unit} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] cursor-pointer text-sm">
                          <input 
                            type="radio" 
                            name="weightUnit" 
                            checked={formData.weightUnit === unit}
                            onChange={() => setFormData({ ...formData, weightUnit: unit })}
                            className="text-[var(--accent)]" 
                          />
                          <span className="text-[var(--text-primary)]">{unit}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Notifications Section */}
          {activeTab === 'notifications' && (
            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="pb-4 border-b border-[var(--border)]">
                <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Telemetry Alerts & Notifications</h2>
                <p className="text-xs text-[var(--text-secondary)]">Set real-time alert thresholds for hive health, swarm risk, and harvest readiness.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'anomalyDetectionAlerts', title: 'Acoustic & Swarm AI Alerts', desc: 'Notify immediately when acoustic frequency drops by > 15%' },
                  { key: 'emailAlerts', title: 'Critical Temperature Alerts', desc: 'Send urgent dispatch if hive core temperature exceeds 38°C' },
                  { key: 'weeklyReport', title: 'Weekly Harvest & Yield Summary', desc: 'Receive automated yield estimation and moisture analysis every Monday' },
                  { key: 'smsAlerts', title: 'Batch Verification Updates', desc: 'Receive SMS when processors log batch receipts on blockchain' }
                ].map((item) => (
                  <label key={item.key} className="flex items-start justify-between p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] cursor-pointer">
                    <div className="pr-4">
                      <p className="font-medium text-sm text-[var(--text-primary)]">{item.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={(formData as any)[item.key]} 
                      onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                      className="mt-1 h-4 w-4 text-[var(--accent)] rounded border-[var(--border)] focus:ring-[var(--accent)]" 
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* API & Nodes Section */}
          {activeTab === 'api' && (
            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="pb-4 border-b border-[var(--border)]">
                <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">IoT Gateway & Smart Contracts</h2>
                <p className="text-xs text-[var(--text-secondary)]">Cryptographic credentials for automated sensor telemetry ingestion.</p>
              </div>

              {/* Demo mode notice */}
              <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2.5 text-xs">
                <Shield size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">Demonstration Environment</p>
                  <p className="text-[var(--text-secondary)] mt-0.5">No live IoT backend is connected. All credentials shown are placeholders for UI demonstration only. Do not enter real API keys here.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Apiary Gateway API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value="hc_demo_••••••••••••••••"
                      className="w-full text-xs font-mono text-[var(--text-secondary)] px-3.5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl cursor-not-allowed opacity-70"
                    />
                    <button
                      disabled
                      className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] cursor-not-allowed opacity-50"
                      title="Not available in demo mode"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 italic">Real key management requires a live backend connection.</p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs space-y-2 text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                    <Shield size={16} className="text-[var(--accent)]" />
                    <span>Blockchain Telemetry Node: Demo Mode</span>
                  </div>
                  <p>Smart Contract Address: <span className="font-mono text-[var(--accent)]">0x7F91...3A12</span> (Polygon PoS — illustrative)</p>
                  <p>In a live deployment, sensor telemetry would be automatically hashed into Merkle trees and anchored every 6 hours.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
