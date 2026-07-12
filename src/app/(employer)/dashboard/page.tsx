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
import styles from "./dashboard.module.css";

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
    return <p className={styles.emptyNote}>Loading dashboard…</p>;
  }
  if (analytics.isError) {
    return (
      <div className={styles.errorPanel}>
        <h3 style={{ marginTop: 0 }}>Couldn&rsquo;t load analytics</h3>
        <p className={styles.emptyNote}>
          {analytics.error instanceof Error ? analytics.error.message : "Unknown error."}
        </p>
      </div>
    );
  }

  const data = analytics.data;
  if (!data) return null;

  return (
    <div>
      <h1 className={styles.pageTitle}>Analytics Dashboard</h1>

      <div className={styles.statGrid}>
        <StatCard
          label="Total Employees"
          value={NUM.format(data.total_enrolled_employees)}
          accent
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
        />
      </div>

      <div className={styles.panel}>
        <h3>Daily Redemptions (last 30 days)</h3>
        {data.daily_trend.length === 0 ? (
          <p className={styles.emptyNote}>
            No redemptions yet — once employees start using their perks, you&rsquo;ll see the
            trend here.
          </p>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={data.daily_trend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="var(--border)" />
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

      <div className={styles.panel}>
        <h3>Top Categories</h3>
        {data.top_categories.length === 0 ? (
          <p className={styles.emptyNote}>No redemption data yet.</p>
        ) : (
          <ul className={styles.categoryRow}>
            {data.top_categories.map((row) => {
              const max = data.top_categories[0]?.count || 1;
              const pct = (row.count / max) * 100;
              return (
                <li key={row.category}>
                  <div className={styles.categoryHead}>
                    <span>{CATEGORY_LABEL[row.category] ?? row.category}</span>
                    <span className={styles.emptyNote}>{NUM.format(row.count)}</span>
                  </div>
                  <div className={styles.categoryTrack}>
                    <div className={styles.categoryFill} style={{ width: `${pct}%` }} />
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
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.value}${accent ? ` ${styles.accent}` : ""}`}>{value}</div>
    </div>
  );
}
