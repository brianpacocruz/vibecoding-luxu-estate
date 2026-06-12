import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getAllProperties } from "@/lib/supabase";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";
import type { UserRoleType } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Client autenticado con cookies — puede leer user_roles gracias a RLS
  const supabase = await createSupabaseServerClient();

  const [properties, { data: usersData }] = await Promise.all([
    getAllProperties(),
    supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const users = usersData ?? [];

  // Derived stats — properties
  const forSale = properties.filter((p) =>
    ["FOR SALE", "Exclusive", "New Arrival"].includes(p.status)
  ).length;
  const forRent = properties.filter((p) => p.status === "FOR RENT").length;
  const featured = properties.filter((p) => p.isFeatured).length;

  // Derived stats — users
  const adminCount = users.filter((u) => u.role === "admin").length;
  const agentCount = users.filter((u) => u.role === "agent").length;
  const userCount  = users.filter((u) => u.role === "user").length;

  const recentProperties = properties.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nordic-dark">Dashboard Overview</h1>
        <p className="text-nordic-muted mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your listings.
        </p>
      </div>

      {/* Stats — Properties */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-nordic-muted uppercase tracking-widest mb-4">
          Properties
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Properties" value={properties.length} icon="apartment" color="green" />
          <StatsCard title="For Sale"         value={forSale}           icon="sell"      color="blue" />
          <StatsCard title="For Rent"         value={forRent}           icon="key"       color="amber" />
          <StatsCard title="Featured"         value={featured}          icon="star"      color="purple" />
        </div>
      </section>

      {/* Stats — Users */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-nordic-muted uppercase tracking-widest mb-4">
          Users
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Users"    value={users.length} icon="group"           color="blue" />
          <StatsCard title="Admins"         value={adminCount}   icon="shield"          color="purple" />
          <StatsCard title="Agents"         value={agentCount}   icon="badge"           color="amber" />
          <StatsCard title="Regular Users"  value={userCount}    icon="person"          color="green" />
        </div>
      </section>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="font-semibold text-nordic-dark">Recent Properties</h2>
            <Link href="/admin/properties" className="text-xs text-mosque font-semibold hover:opacity-70 transition-opacity">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {recentProperties.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-background-light/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-mosque/10 flex items-center justify-center shrink-0">
                  <span className="material-icons text-mosque text-base">apartment</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-nordic-dark truncate">{p.title}</p>
                  <p className="text-xs text-nordic-muted truncate">{p.location}</p>
                </div>
                <span className="text-sm font-semibold text-nordic-dark shrink-0">
                  ${p.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="font-semibold text-nordic-dark">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-mosque font-semibold hover:opacity-70 transition-opacity">
              Manage roles →
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {recentUsers.map((u) => {
              const role = u.role as UserRoleType;
              return (
                <div key={u.user_id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-background-light/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-nordic-dark/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {u.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatar_url} alt={u.full_name ?? ""} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-icons text-nordic-muted text-base">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-nordic-dark truncate">{u.full_name ?? u.email ?? "–"}</p>
                    <p className="text-xs text-nordic-muted truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    role === "admin" ? "bg-violet-50 text-violet-700 border-violet-200"
                    : role === "agent" ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-sky-50 text-sky-600 border-sky-200"
                  }`}>
                    {role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
