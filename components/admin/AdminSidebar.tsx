"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/properties", label: "Properties", icon: "apartment" },
  { href: "/admin/users", label: "Users & Roles", icon: "manage_accounts" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 bg-nordic-dark flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-mosque rounded-lg flex items-center justify-center shadow-lg">
            <span className="material-icons text-white text-base">real_estate_agent</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">LuxeEstate</p>
            <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-mosque text-white shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className={`material-icons text-[18px] transition-colors ${
                  isActive ? "text-white" : "text-white/40 group-hover:text-white"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Sign Out */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-mosque/40 flex items-center justify-center">
              <span className="material-icons text-white/70 text-base">person</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.user_metadata?.full_name ?? user?.email ?? "Admin"}
            </p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <span className="material-icons text-[18px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
