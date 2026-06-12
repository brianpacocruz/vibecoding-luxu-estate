"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { UserRole, UserRoleType } from "@/lib/supabase";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

async function updateUserRoleClient(userId: string, role: UserRoleType): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("user_roles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating role:", error.message);
    return false;
  }
  return true;
}

const ROLE_STYLES: Record<UserRoleType, string> = {
  admin: "bg-violet-50 text-violet-700 border-violet-200",
  agent: "bg-amber-50 text-amber-700 border-amber-200",
  user: "bg-sky-50 text-sky-600 border-sky-200",
};

const ROLE_ICONS: Record<UserRoleType, string> = {
  admin: "shield",
  agent: "badge",
  user: "person",
};

export default function UsersTable({ users, currentUserId }: { users: UserRole[]; currentUserId: string }) {
  const [roles, setRoles] = useState<Record<string, UserRoleType>>(
    Object.fromEntries(users.map((u) => [u.userId, u.role]))
  );
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [, startTransition] = useTransition();

  async function handleRoleChange(userId: string, newRole: UserRoleType) {
    setSaving((prev) => ({ ...prev, [userId]: true }));
    const ok = await updateUserRoleClient(userId, newRole);
    setSaving((prev) => ({ ...prev, [userId]: false }));

    if (ok) {
      setRoles((prev) => ({ ...prev, [userId]: newRole }));
      startTransition(() => {
        setToast({ message: "Role updated successfully!", ok: true });
        setTimeout(() => setToast(null), 3000);
      });
    } else {
      setToast({ message: "Failed to update role. Try again.", ok: false });
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div className="relative">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.ok
              ? "bg-emerald-600 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="material-icons text-base">
            {toast.ok ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-black/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-nordic-dark/5 text-nordic-muted text-xs font-semibold uppercase tracking-wider">
              <th className="px-5 py-3.5 text-left">User</th>
              <th className="px-5 py-3.5 text-left">Email</th>
              <th className="px-5 py-3.5 text-left">Current Role</th>
              <th className="px-5 py-3.5 text-left">Change Role</th>
              <th className="px-5 py-3.5 text-left">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white">
            {users.map((user) => {
              const currentRole = roles[user.userId] ?? user.role;
              const isSelf = user.userId === currentUserId;
              return (
                <tr
                  key={user.userId}
                  className={`hover:bg-background-light/50 transition-colors ${
                    isSelf ? "bg-mosque/3" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.fullName ?? "User"}
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-nordic-dark/10 flex items-center justify-center">
                          <span className="material-icons text-nordic-muted text-base">person</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-nordic-dark">
                          {user.fullName ?? "–"}
                          {isSelf && (
                            <span className="ml-2 text-xs font-normal text-mosque bg-mosque/10 px-1.5 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-nordic-muted font-mono">
                          {user.userId.slice(0, 8)}…
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-nordic-muted">{user.email ?? "–"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_STYLES[currentRole]}`}
                    >
                      <span className="material-icons text-[13px]">
                        {ROLE_ICONS[currentRole]}
                      </span>
                      {currentRole}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative inline-flex items-center gap-2">
                      <select
                        value={currentRole}
                        disabled={saving[user.userId]}
                        onChange={(e) =>
                          handleRoleChange(user.userId, e.target.value as UserRoleType)
                        }
                        className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium bg-white border border-black/10 rounded-lg text-nordic-dark focus:outline-none focus:ring-2 focus:ring-mosque/30 focus:border-mosque transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <option value="user">user</option>
                        <option value="agent">agent</option>
                        <option value="admin">admin</option>
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-icons text-sm text-nordic-muted">
                        {saving[user.userId] ? "autorenew" : "expand_more"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-nordic-muted text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
