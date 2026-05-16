"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { employerApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

const CAD = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const NUM = new Intl.NumberFormat("en-CA");

const CATEGORY_LABEL: Record<string, string> = {
  travel: "Travel",
  groceries: "Groceries",
  entertainment: "Entertainment",
  health: "Health & Wellness",
  dining: "Dining",
  shopping: "Shopping",
  electronics: "Electronics",
  services: "Services",
  other: "Other",
};

export default function DashboardPage() {
  const analytics = useQuery({
    queryKey: qk.employer.analytics,
    queryFn: () => employerApi.analytics(),
  });

  if (analytics.isLoading) {
    return <p style={{ color: "var(--text-muted)" }}>Loading dashboard…</p>;
  }
  if (analytics.isError) {
    return (
      <div className="card" style={{ borderColor: "rgba(220,38,38,0.4)" }}>
        <h3 style={{ marginTop: 0 }}>Couldn&rsquo;t load analytics</h3>
        <p style={{ color: "var(--text-muted)" }}>
          {analytics.error instanceof Error ? analytics.error.message : "Unknown error."}
        </p>
      </div>
    );
  }

  const data = analytics.data;
  if (!data) return null;

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>Analytics Dashboard</h1>

      <div className="grid" style={{ marginBottom: "2rem" }}>
        <StatCard
          label="Total Employees"
          value={NUM.format(data.total_enrolled_employees)}
          color="var(--primary)"
        />
        <StatCard
          label="Monthly Active Users"
          value={NUM.format(data.monthly_active_users)}
        />
        <StatCard
          label="Redemptions (MTD)"
          value={NUM.format(data.redemptions_mtd)}
        />
        <StatCard
          label="Estimated Savings (YTD)"
          value={CAD.format(data.estimated_savings_cad)}
          color="#10b981"
        />
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Daily Redemptions (last 30 days)</h3>
        {data.daily_trend.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            No redemptions yet — once employees start using their perks, you&rsquo;ll see the trend here.
          </p>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={data.daily_trend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Top Categories</h3>
        {data.top_categories.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No redemption data yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {data.top_categories.map((row) => {
              const max = data.top_categories[0]?.count || 1;
              const pct = (row.count / max) * 100;
              return (
                <li key={row.category}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                      marginBottom: 4,
                    }}
                  >
                    <span>{CATEGORY_LABEL[row.category] ?? row.category}</span>
                    <span style={{ color: "var(--text-muted)" }}>{NUM.format(row.count)}</span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "var(--border)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <span className="text-muted">{label}</span>
      <strong style={{ fontSize: "2.25rem", color: color ?? "var(--foreground)" }}>{value}</strong>
    </div>
  );
}
