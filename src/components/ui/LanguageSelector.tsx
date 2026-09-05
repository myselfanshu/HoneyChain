import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageCode } from '@/i18n/types';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  compact = false,
  className = '' 
}) => {
  const { language, setLanguage, languages, currentLanguageInfo, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const filteredLanguages = languages.filter((lang) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--surface-secondary)] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 min-w-[130px]"
        aria-label={t.common.selectLanguage}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Globe size={15} className="text-[var(--accent)] shrink-0" />
          <span className="truncate font-serif font-semibold">
            {compact ? currentLanguageInfo.code.toUpperCase() : currentLanguageInfo.nativeName}
          </span>
        </div>
        <ChevronDown 
          size={13} 
          className={`text-[var(--text-secondary)] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl z-50 p-2 focus:outline-none animate-fade-in"
        >
          {/* Search Header */}
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search / भाषा खोजें..."
              className="w-full text-xs bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] placeholder:text-[var(--text-secondary)]"
            />
          </div>

          <div className="px-2 pb-1 text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
            {t.common.selectLanguage} ({filteredLanguages.length})
          </div>

          <div className="py-0.5 max-h-56 overflow-y-auto space-y-0.5">
            {filteredLanguages.length === 0 ? (
              <div className="p-3 text-center text-xs text-[var(--text-secondary)]">
                No matching language
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                      isSelected
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-bold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] font-medium'
                    }`}
                  >
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-sm font-serif font-semibold">{lang.nativeName}</span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-sans">
                        {lang.name}
                      </span>
                    </div>
                    {isSelected && <Check size={14} className="text-[var(--accent)] shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
