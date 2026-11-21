const TONES = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-700",
};

export default function StatCard({ label, value, icon: Icon, tone = "primary" }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}