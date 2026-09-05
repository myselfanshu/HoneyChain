import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save, Edit2, CheckCircle2 } from 'lucide-react';
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
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Network Trust Rating: <strong className="text-[var(--accent)]">96/100 (Certified)</strong></span>
                  <span>Registered: March 2024</span>
                </div>
              </div>
            </section>
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
