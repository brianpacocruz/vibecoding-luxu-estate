"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS, type Locale } from "@/lib/i18n";

export function LanguageSelector() {
  const { locale, setLocale, isLoading } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        disabled={isLoading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-nordic-dark/70 hover:text-nordic-dark hover:bg-black/5 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-wait"
        title="Change language"
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:block uppercase tracking-wide text-xs font-semibold">
          {locale}
        </span>
        {isLoading ? (
          <span className="material-icons text-sm animate-spin">autorenew</span>
        ) : (
          <span
            className={`material-icons text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            expand_more
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-soft border border-nordic-dark/8 overflow-hidden z-[60] animate-fadeInDown"
        >
          {LOCALES.map((loc) => {
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(loc)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-mosque/5 text-mosque font-semibold"
                    : "text-nordic-dark hover:bg-black/4 hover:text-nordic-dark"
                }`}
              >
                <span className="text-lg leading-none">{LOCALE_FLAGS[loc]}</span>
                <span className="flex-1 text-left">{LOCALE_NAMES[loc]}</span>
                {isActive && (
                  <span className="material-icons text-mosque text-base">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
