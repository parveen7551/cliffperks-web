"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employerApi, ApiError } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const list = useQuery({
    queryKey: qk.employer.announcements,
    queryFn: () => employerApi.listAnnouncements(),
  });

  const [showForm, setShowForm] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyFr, setBodyFr] = useState("");
  const [publishNow, setPublishNow] = useState(true);

  const createMutation = useMutation({
    mutationFn: () =>
      employerApi.createAnnouncement({
        title_en: titleEn,
        title_fr: titleFr,
        body_en: bodyEn,
        body_fr: bodyFr,
        published_at: publishNow ? new Date().toISOString() : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.employer.announcements });
      setTitleEn("");
      setTitleFr("");
      setBodyEn("");
      setBodyFr("");
      setShowForm(false);
    },
  });

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Announcements</h1>
        <button
          type="button"
          className="btn"
          style={{ background: "#1E2B4A" }}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "New announcement"}
        </button>
      </header>

      {showForm && (
        <form
          className="card"
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <Field label="Title (English)">
            <input
              required
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Title (French)">
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Body (English)">
            <textarea
              required
              rows={4}
              value={bodyEn}
              onChange={(e) => setBodyEn(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
          <Field label="Body (French)">
            <textarea
              rows={4}
              value={bodyFr}
              onChange={(e) => setBodyFr(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
            />
            Publish immediately
          </label>
          {createMutation.isError && (
            <div style={{ color: "#b91c1c", fontSize: "0.875rem" }}>
              {createMutation.error instanceof ApiError
                ? createMutation.error.message
                : "Couldn't create announcement."}
            </div>
          )}
          <button type="submit" className="btn" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving…" : "Save announcement"}
          </button>
        </form>
      )}

      {list.isLoading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading announcements…</p>
      ) : list.isError ? (
        <div className="card" style={{ borderColor: "rgba(220,38,38,0.3)" }}>
          Couldn&rsquo;t load announcements.
        </div>
      ) : list.data!.results.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "var(--text-muted)" }}>
          No announcements yet. Use “New announcement” to share something with your team.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {list.data!.results.map((a) => (
            <article key={a.id} className="card">
              <header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{a.title_en}</h3>
                <small style={{ color: "var(--text-muted)" }}>
                  {a.published_at
                    ? new Date(a.published_at).toLocaleString("en-CA")
                    : "Draft"}
                </small>
              </header>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{a.body_en}</p>
              {a.body_fr && (
                <p
                  style={{
                    margin: "0.75rem 0 0",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                    whiteSpace: "pre-wrap",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  {a.body_fr}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--card-bg)",
  color: "var(--foreground)",
  fontFamily: "inherit",
  fontSize: "0.9375rem",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}
