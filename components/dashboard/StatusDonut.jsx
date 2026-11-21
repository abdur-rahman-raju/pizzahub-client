"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  pending: "#f59e0b",
  accepted: "#16a34a",
  approved: "#16a34a",
  rejected: "#dc2626",
  cancelled: "#6b7280",
  inactive: "#6b7280",
};

export default function StatusDonut({ counts }) {
  const entries = Object.entries(counts);
  const data = entries
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Nothing to chart yet
      </p>
    );
  }

  return (
    <div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || "#6b7280"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {entries.map(([name, value]) => (
          <li key={name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[name] || "#6b7280" }}
            />
            <span className="capitalize">{name}</span>
            <span className="ml-auto font-semibold">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}