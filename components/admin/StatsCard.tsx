interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: "green" | "blue" | "purple" | "amber";
}

const colorMap = {
  green: "bg-emerald-500/10 text-emerald-600",
  blue: "bg-sky-500/10 text-sky-600",
  purple: "bg-violet-500/10 text-violet-600",
  amber: "bg-amber-500/10 text-amber-600",
};

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  color = "green",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5 hover:shadow-soft transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <span className="material-icons text-xl">{icon}</span>
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trendUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-nordic-dark mb-1">{value}</p>
      <p className="text-sm text-nordic-muted">{title}</p>
    </div>
  );
}
