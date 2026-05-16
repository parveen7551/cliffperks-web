"use client";

import { useQuery } from "@tanstack/react-query";
import type { LedgerReason } from "@cliffperks/shared";
import { employeeApi } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

const NUM = new Intl.NumberFormat("en-CA");

const REASON_LABEL: Record<LedgerReason, string> = {
  earn_redemption: "Earned from redemption",
  adjustment: "Adjustment",
  spend_gift_card: "Gift card",
  spend_donation: "Donation",
};

export default function PointsPage() {
  const points = useQuery({
    queryKey: qk.employee.points,
    queryFn: () => employeeApi.points(),
  });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <h1 style={{ margin: "0 0 1.5rem", fontSize: "2rem" }}>CliffPoints</h1>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1e2b4a 0%, #2a3a66 100%)",
          color: "#fff",
          textAlign: "center",
          padding: "2.5rem 1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ margin: 0, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.75rem", fontWeight: 700 }}>
          Current balance
        </p>
        <strong style={{ fontSize: "3.5rem", fontWeight: 800, letterSpacing: "-0.03em", display: "block", marginTop: 4 }}>
          {points.isLoading ? "—" : NUM.format(points.data?.balance ?? 0)}
        </strong>
        <p style={{ margin: 0, opacity: 0.7 }}>points</p>
      </div>

      <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>Recent activity</h2>

      {points.isLoading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : points.isError ? (
        <div className="card" style={{ borderColor: "rgba(220,38,38,0.3)" }}>
          Couldn&rsquo;t load points history.
        </div>
      ) : points.data && points.data.recent.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {points.data.recent.map((entry) => (
            <li
              key={entry.id}
              className="card"
              style={{
                padding: "0.875rem 1.125rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {REASON_LABEL[entry.reason] ?? entry.reason}
                </p>
                <small style={{ color: "var(--text-muted)" }}>
                  {new Date(entry.created_at).toLocaleString("en-CA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </small>
              </div>
              <strong
                style={{
                  fontSize: "1.125rem",
                  color: entry.delta >= 0 ? "#15803d" : "#b91c1c",
                }}
              >
                {entry.delta >= 0 ? "+" : ""}
                {NUM.format(entry.delta)}
              </strong>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card" style={{ textAlign: "center", color: "var(--text-muted)" }}>
          No activity yet — redeem a perk to start earning.
        </div>
      )}
    </div>
  );
}
