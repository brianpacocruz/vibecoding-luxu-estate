"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function ProfileDropdown() {
  const { user, isLoading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
        <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
        <Link
          href="/login"
          className="text-sm font-medium text-nordic-dark bg-mosque/10 hover:bg-mosque hover:text-white px-4 py-2 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Obtenemos el avatar de la metadata del usuario de Supabase (Google/Github)
  const avatarUrl = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div ref={ref} className="relative flex items-center pl-2 border-l border-nordic-dark/10 ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque focus:ring-mosque transition-all flex items-center justify-center text-nordic-dark font-semibold">
          {avatarUrl ? (
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={avatarUrl}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{name?.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-soft border border-nordic-dark/8 overflow-hidden z-[60] animate-fadeInDown">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-nordic-dark truncate">
              {name}
            </p>
            <p className="text-xs text-nordic-muted truncate">
              {user.email}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <span className="material-icons text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
