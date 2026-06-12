import { createSupabaseServerClient } from "@/lib/supabase-server";
import UsersTable from "@/components/admin/UsersTable";
import type { UserRole, UserRoleType } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error.message);
  }

  const users: UserRole[] = (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    role: row.role as UserRoleType,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }));

  const adminCount = users.filter((u) => u.role === "admin").length;
  const agentCount = users.filter((u) => u.role === "agent").length;
  const userCount  = users.filter((u) => u.role === "user").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
            <span className="material-icons text-violet-600 text-base">manage_accounts</span>
          </div>
          <h1 className="text-2xl font-bold text-nordic-dark">Users &amp; Roles</h1>
        </div>
        <p className="text-nordic-muted">Manage access levels for all authenticated users.</p>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-violet-100 px-5 py-4 flex items-center gap-4 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <span className="material-icons text-violet-600 text-lg">shield</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-nordic-dark">{adminCount}</p>
            <p className="text-sm text-violet-600 font-medium">Admins</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 px-5 py-4 flex items-center gap-4 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <span className="material-icons text-amber-600 text-lg">badge</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-nordic-dark">{agentCount}</p>
            <p className="text-sm text-amber-600 font-medium">Agents</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-sky-100 px-5 py-4 flex items-center gap-4 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
            <span className="material-icons text-sky-600 text-lg">group</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-nordic-dark">{userCount}</p>
            <p className="text-sm text-sky-600 font-medium">Regular Users</p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/70 rounded-xl px-5 py-3.5 mb-6">
        <span className="material-icons text-amber-600 text-base mt-0.5 shrink-0">info</span>
        <p className="text-sm text-amber-800">
          Changes to roles take effect immediately. The user will need to refresh their session to see updated permissions.
        </p>
      </div>

      <UsersTable users={users} currentUserId="" />
    </div>
  );
}
