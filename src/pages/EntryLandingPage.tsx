import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronRight, ArrowRight, Shield, Zap, QrCode, Lock, User, Mail, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import HoneycombLogo from '@/components/ui/HoneycombLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

// ─── CAPTCHA Widget ────────────────────────────────────────────────────────────
const CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY || '';

interface CaptchaWidgetProps {
  onVerify: (token: string | null) => void;
  isDemoMode: boolean;
}

const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerify, isDemoMode }) => {
  const { t } = useTranslation();
  const [verified, setVerified] = useState(isDemoMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setVerified(true);
      onVerify('demo-bypass');
      return;
    }
    if (!CAPTCHA_SITE_KEY) return;

    // Load Cloudflare Turnstile script once
    const scriptId = 'cf-turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const renderWidget = () => {
      if (containerRef.current && (window as unknown as Record<string, unknown>).turnstile) {
        const turnstile = (window as unknown as Record<string, unknown>).turnstile as {
          render: (el: HTMLElement, opts: Record<string, unknown>) => number;
          reset: (id: number) => void;
        };
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: CAPTCHA_SITE_KEY,
          callback: (token: string) => { setVerified(true); onVerify(token); },
          'expired-callback': () => { setVerified(false); onVerify(null); },
          'error-callback': () => { setVerified(false); onVerify(null); },
          theme: 'light',
          size: 'normal',
        });
      }
    };

    const checkInterval = setInterval(() => {
      if ((window as unknown as Record<string, unknown>).turnstile) {
        clearInterval(checkInterval);
        renderWidget();
      }
    }, 200);

    return () => { clearInterval(checkInterval); };
  }, [isDemoMode, onVerify]);

  if (isDemoMode) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
        <Shield size={14} className="shrink-0" />
        <div>
          <span className="font-semibold">{t.auth.demoSecurityMode}</span>
          <span className="block opacity-70 mt-0.5">{t.auth.demoSecurityDesc}</span>
        </div>
      </div>
    );
  }

  if (!CAPTCHA_SITE_KEY) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
        <Shield size={14} className="shrink-0" />
        <span>{t.auth.demoSecurityMode} · {t.auth.demoSecurityDesc}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--text-secondary)] font-medium">{t.auth.captchaTitle}</p>
      {!verified && (
        <>
          <div ref={containerRef} className="rounded-xl overflow-hidden" />
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <div className="w-3 h-3 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            {t.auth.captchaPending}
          </div>
        </>
      )}
      {verified && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
          <Shield size={12} />
          {t.auth.captchaVerified}
        </div>
      )}
    </div>
  );
};

// ─── Password Strength Meter ────────────────────────────────────────────────────
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const { t } = useTranslation();
  const score = password.length === 0 ? 0
    : password.length < 8 ? 1
    : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
    : 2;
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const labels = ['', t.auth.passwordWeak, t.auth.passwordWeak, t.auth.passwordStrong, t.auth.passwordStrong];
  if (!password) return null;
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-[var(--border)]'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-medium ${score >= 3 ? 'text-emerald-600' : 'text-orange-500'}`}>{labels[score]}</p>
    </div>
  );
};

// ─── Honeycomb 3D Visual ────────────────────────────────────────────────────────
const HoneycombVisual: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-300/20 via-transparent to-transparent" />
      
      {/* SVG Honeycomb */}
      <svg viewBox="0 0 320 360" className="w-full max-w-sm opacity-90" fill="none">
        <defs>
          <linearGradient id="hexGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id="hexGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        
        {/* Hexagon grid — rows of 3-4-3-4-3 */}
        {(
          [
            // Row 1 (y=60, 3 hexes)
            [80, 60], [160, 60], [240, 60],
            // Row 2 (y=130, 4 hexes offset)
            [40, 130], [120, 130], [200, 130], [280, 130],
            // Row 3 (y=200, 3 hexes)
            [80, 200], [160, 200], [240, 200],
            // Row 4 (y=270, 4 hexes)
            [40, 270], [120, 270], [200, 270], [280, 270],
            // Row 5 (y=340, 3 hexes)
            [80, 340], [160, 340], [240, 340],
          ] as [number, number][]
        ).map(([cx, cy], i) => {
          const size = 36;
          const pts = Array.from({ length: 6 }, (_, k) => {
            const angle = (Math.PI / 180) * (60 * k - 30);
            return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
          }).join(' ');
          const isCenter = i === 8; // middle hex highlighted
          const isHighlight = [4, 9, 12].includes(i);
          return (
            <g key={i}>
              <polygon
                points={pts}
                fill={isCenter ? 'url(#hexGrad1)' : isHighlight ? 'url(#hexGrad2)' : theme === 'dark' ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.15)'}
                stroke={isCenter ? '#F59E0B' : '#D97706'}
                strokeWidth={isCenter ? 2 : 1}
                filter={isCenter ? 'url(#glow)' : undefined}
                className="transition-all duration-700"
                style={{ animationDelay: `${i * 80}ms` }}
              />
              {isCenter && (
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize="18" fill={theme === 'dark' ? '#FCD34D' : '#92400E'} className="font-bold">⬡</text>
              )}
            </g>
          );
        })}
        
        {/* Honey drop animation */}
        <circle cx="160" cy="200" r="8" fill="#F59E0B" opacity="0.6" filter="url(#glow)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite"/>
        </circle>
      </svg>
      
      {/* Floating label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-amber-600/70 uppercase">Verified Provenance</span>
      </div>
    </div>
  );
};

// ─── Auth Modal (Sign In / Register) ─────────────────────────────────────────
type AuthMode = 'signin' | 'register';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  captchaDemoMode: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSwitchMode, captchaDemoMode }) => {
  const { t } = useTranslation();
  const { login, register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(captchaDemoMode ? 'demo' : null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => { clearError(); setLocalError(null); }, [mode, clearError]);

  const handleCaptchaVerify = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const validate = (): string | null => {
    if (mode === 'register' && !name.trim()) return t.auth.nameRequired;
    if (!email.includes('@')) return t.auth.invalidEmail;
    if (password.length < 8) return t.auth.passwordTooShort;
    if (mode === 'register' && password !== confirmPassword) return t.auth.passwordMismatch;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setLocalError(validationError); return; }
    setLocalError(null);
    try {
      if (mode === 'signin') {
        await login(email, password, captchaToken || undefined);
      } else {
        await register(name, email, password, confirmPassword, 'BEEKEEPER', captchaToken || undefined);
      }
      navigate('/home');
    } catch {
      // Error is handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-[var(--border)]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-full transition-colors cursor-pointer"
            aria-label={t.common.close}
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <HoneycombLogo size={28} />
            <span className="font-serif font-bold text-[var(--text-primary)] text-lg">HoneyChain</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-1">
            {mode === 'signin' ? t.auth.signInTitle : t.auth.registerTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {mode === 'signin' ? t.auth.signInSubtitle : t.auth.registerSubtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t.auth.fullName}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t.auth.email}</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t.auth.password}</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full pl-10 pr-12 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {mode === 'register' && <PasswordStrength password={password} />}
          </div>

          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t.auth.confirmPassword}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* CAPTCHA */}
          <CaptchaWidget onVerify={handleCaptchaVerify} isDemoMode={captchaDemoMode} />

          {/* Error */}
          {displayError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
              {displayError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || (!captchaToken && !captchaDemoMode)}
            className="w-full py-3.5 px-6 bg-[var(--accent)] text-white font-semibold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'signin' ? t.auth.signingIn : t.auth.registering}
              </>
            ) : (
              <>
                {mode === 'signin' ? t.auth.signInButton : t.auth.registerButton}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Switch mode */}
          <p className="text-center text-xs text-[var(--text-secondary)]">
            {mode === 'signin' ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}{' '}
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              {mode === 'signin' ? t.auth.switchToRegister : t.auth.switchToSignIn}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// ─── Entry Landing Page ─────────────────────────────────────────────────────────
const EntryLandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { continueAsGuest, isAuthenticated, isGuest, captchaDemoMode } = useAuth();
  const navigate = useNavigate();

  const [authModal, setAuthModal] = useState<AuthMode | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [verifyId, setVerifyId] = useState('');

  // If already signed in, redirect to app
  useEffect(() => {
    if (isAuthenticated || isGuest) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, isGuest, navigate]);

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      await continueAsGuest();
      navigate('/home');
    } catch {
      // error displayed by AuthContext
    } finally {
      setGuestLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const id = verifyId.trim() || 'HC-2026-0142';
    navigate(`/verify/${id}`);
  };

  const pillars = [
    { icon: Zap, title: t.entry.pillar1Title, desc: t.entry.pillar1Desc },
    { icon: Shield, title: t.entry.pillar2Title, desc: t.entry.pillar2Desc },
    { icon: QrCode, title: t.entry.pillar3Title, desc: t.entry.pillar3Desc },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 px-4 sm:px-8 flex items-center justify-between bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]/50">
        <div className="flex items-center gap-2.5">
          <HoneycombLogo size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-base tracking-wide text-[var(--text-primary)]">HONEY</span>
            <span className="font-sans text-[0.55rem] font-bold tracking-[0.3em] text-[var(--accent)]">CHAIN</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setAuthModal('signin')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/30 rounded-full hover:bg-[var(--accent)]/5 transition-colors"
          >
            {t.entry.signIn}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-16 grid lg:grid-cols-2 items-center gap-0">
        {/* Left: Text & CTA */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-20 lg:py-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/80 dark:bg-amber-900/20 border border-amber-300/50 dark:border-amber-700/50 rounded-full mb-8 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400 tracking-[0.2em] uppercase">Verified Honey Provenance</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-bold leading-[0.9] mb-6">
            <span className="block text-5xl sm:text-6xl lg:text-7xl text-[var(--text-primary)]">{t.entry.taglineLead}</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl text-[var(--accent)]">{t.entry.taglineSub}</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-3 max-w-md font-light">
            {t.entry.subtitle}
          </p>
          <p className="text-sm text-[var(--text-secondary)]/70 mb-10 max-w-sm">
            {t.entry.trustLine}
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => setAuthModal('signin')}
              className="flex items-center justify-center gap-2.5 px-7 py-4 bg-[var(--accent)] text-white font-semibold text-sm rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-500/20"
            >
              {t.entry.signIn}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setAuthModal('register')}
              className="flex items-center justify-center gap-2.5 px-7 py-4 bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--text-primary)] font-semibold text-sm rounded-2xl hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95 transition-all duration-200"
            >
              {t.entry.createAccount}
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Guest Access */}
          <button
            onClick={handleGuest}
            disabled={guestLoading}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors self-start group disabled:opacity-50"
          >
            {guestLoading ? (
              <div className="w-4 h-4 border-2 border-[var(--text-secondary)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] group-hover:border-[var(--accent)] flex items-center justify-center transition-colors">
                <ChevronRight size={10} />
              </div>
            )}
            <span>{guestLoading ? t.auth.enteringAsGuest : t.entry.guestAccess}</span>
            <span className="text-xs text-[var(--text-secondary)]/60">— {t.entry.guestDesc}</span>
          </button>

          {/* Trust Pillars */}
          <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-[var(--border)]">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-2 text-[var(--accent)] group-hover:scale-110 transition-transform">
                  <Icon size={16} />
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{title}</p>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed hidden sm:block">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hidden lg:flex items-center justify-center h-screen bg-gradient-to-br from-amber-50/60 via-[var(--surface)] to-amber-100/30 dark:from-amber-950/20 dark:via-[var(--surface)] dark:to-amber-900/10 border-l border-[var(--border)]">
          <HoneycombVisual />
        </div>
      </section>

      {/* Quick Verify Strip */}
      <section className="px-6 sm:px-10 lg:px-20 py-12 bg-[var(--surface)] border-t border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto text-center">
          <QrCode size={24} className="text-[var(--accent)] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-xl text-[var(--text-primary)] mb-1">{t.entry.verifyJar}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-5">{t.entry.verifyJarDesc}</p>
          <form onSubmit={handleVerify} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={verifyId}
              onChange={e => setVerifyId(e.target.value)}
              placeholder="HC-2026-0142"
              className="flex-1 px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors font-mono"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[var(--accent)] text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
            >
              {t.consumer.viewFullStory} <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          mode={authModal}
          captchaDemoMode={captchaDemoMode || !CAPTCHA_SITE_KEY}
          onClose={() => setAuthModal(null)}
          onSwitchMode={setAuthModal}
        />
      )}
    </div>
  );
};

export default EntryLandingPage;
