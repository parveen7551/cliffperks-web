"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HRISProvider } from "@cliffperks/shared";
import { employerApi, ApiError } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

const HRIS_LABEL: Record<HRISProvider, string> = {
  none: "None (CSV only)",
  bamboohr: "BambooHR",
  rippling: "Rippling",
  workday: "Workday",
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const employer = useQuery({
    queryKey: qk.employer.me,
    queryFn: () => employerApi.me(),
  });

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    brand_color: "",
    hris_provider: "none" as HRISProvider,
    allowed_email_domains: "",
  });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (employer.data && !dirty) {
      setForm({
        name: employer.data.name,
        logo_url: employer.data.logo_url,
        brand_color: employer.data.brand_color,
        hris_provider: employer.data.hris_provider,
        allowed_email_domains: employer.data.allowed_email_domains,
      });
    }
  }, [employer.data, dirty]);

  const save = useMutation({
    mutationFn: () => employerApi.updateMe(form),
    onSuccess: (data) => {
      queryClient.setQueryData(qk.employer.me, data);
      setDirty(false);
    },
  });

  if (employer.isLoading) {
    return <p style={{ color: "var(--text-muted)" }}>Loading…</p>;
  }
  if (employer.isError || !employer.data) {
    return (
      <div className="card" style={{ borderColor: "rgba(220,38,38,0.3)" }}>
        Couldn&rsquo;t load employer profile.
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem", fontSize: "2rem" }}>Settings</h1>

      <form
        className="card"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 640 }}
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Company name">
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setDirty(true);
            }}
            style={inputStyle}
          />
        </Field>

        <Field label="Subdomain (read-only)">
          <input
            type="text"
            value={employer.data.subdomain}
            disabled
            style={{ ...inputStyle, opacity: 0.6 }}
          />
        </Field>

        <Field label="Logo URL">
          <input
            type="url"
            value={form.logo_url}
            onChange={(e) => {
              setForm({ ...form, logo_url: e.target.value });
              setDirty(true);
            }}
            style={inputStyle}
          />
        </Field>

        <Field label="Brand colour (#RRGGBB)">
          <input
            type="text"
            value={form.brand_color}
            onChange={(e) => {
              setForm({ ...form, brand_color: e.target.value });
              setDirty(true);
            }}
            style={inputStyle}
            placeholder="#1E2B4A"
          />
        </Field>

        <Field label="HRIS provider">
          <select
            value={form.hris_provider}
            onChange={(e) => {
              setForm({ ...form, hris_provider: e.target.value as HRISProvider });
              setDirty(true);
            }}
            style={inputStyle}
          >
            {(Object.keys(HRIS_LABEL) as HRISProvider[]).map((p) => (
              <option key={p} value={p}>
                {HRIS_LABEL[p]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Allowed email domains (comma-separated)">
          <input
            type="text"
            value={form.allowed_email_domains}
            onChange={(e) => {
              setForm({ ...form, allowed_email_domains: e.target.value });
              setDirty(true);
            }}
            style={inputStyle}
            placeholder="acme.com,acme.ca"
          />
        </Field>

        {save.isError && (
          <div style={{ color: "#b91c1c", fontSize: "0.875rem" }}>
            {save.error instanceof ApiError ? save.error.message : "Save failed."}
          </div>
        )}
        {save.isSuccess && !dirty && (
          <div style={{ color: "#15803d", fontSize: "0.875rem" }}>
            Saved.
          </div>
        )}

        <button
          type="submit"
          className="btn"
          disabled={!dirty || save.isPending}
          style={{ alignSelf: "flex-start" }}
        >
          {save.isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  border: "1px solid var(--border)",
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
