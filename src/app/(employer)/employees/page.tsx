"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EmployeeStatus } from "@cliffperks/shared";
import { employerApi, ApiError } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

const STATUS_LABEL: Record<EmployeeStatus, string> = {
  invited: "Invited",
  active: "Active",
  suspended: "Suspended",
  offboarded: "Offboarded",
};

const STATUS_COLOR: Record<EmployeeStatus, string> = {
  invited: "#f59e0b",
  active: "#10b981",
  suspended: "#6b7280",
  offboarded: "#9ca3af",
};

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"" | EmployeeStatus>("");
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");

  const params = useMemo(
    () => ({
      page,
      status: statusFilter || undefined,
      search: search || undefined,
    }),
    [page, statusFilter, search],
  );

  const roster = useQuery({
    queryKey: qk.employer.employees(params),
    queryFn: () => employerApi.listEmployees(params),
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => employerApi.importEmployees(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer", "employees"] });
      queryClient.invalidateQueries({ queryKey: qk.employer.analytics });
    },
  });

  const offboardMutation = useMutation({
    mutationFn: (id: string) => employerApi.offboardEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer", "employees"] });
    },
  });

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importMutation.mutate(file);
    e.target.value = "";
  }

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Employees</h1>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,.tsv"
            onChange={onFileChosen}
            hidden
          />
          <button
            type="button"
            className="btn"
            disabled={importMutation.isPending}
            onClick={() => fileInput.current?.click()}
          >
            {importMutation.isPending ? "Importing…" : "Import CSV"}
          </button>
        </div>
      </header>

      {importMutation.isSuccess && (
        <div
          className="card"
          style={{
            marginBottom: "1rem",
            background: "rgba(34,197,94,0.08)",
            borderColor: "rgba(34,197,94,0.3)",
          }}
        >
          <strong>Import complete.</strong>{" "}
          <span style={{ color: "var(--text-muted)" }}>
            {importMutation.data.created} created, {importMutation.data.updated}{" "}
            updated, {importMutation.data.skipped} skipped.
            {importMutation.data.errors.length > 0 && (
              <>
                {" "}
                <details style={{ display: "inline" }}>
                  <summary style={{ cursor: "pointer", display: "inline" }}>
                    {importMutation.data.errors.length} errors
                  </summary>
                  <ul style={{ marginTop: "0.5rem" }}>
                    {importMutation.data.errors.map((err, i) => (
                      <li key={i}>{formatImportError(err)}</li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </span>
        </div>
      )}

      {importMutation.isError && (
        <div
          className="card"
          style={{
            marginBottom: "1rem",
            background: "rgba(220,38,38,0.06)",
            borderColor: "rgba(220,38,38,0.3)",
          }}
        >
          <strong>Import failed.</strong>{" "}
          <span style={{ color: "var(--text-muted)" }}>
            {importMutation.error instanceof ApiError
              ? importMutation.error.message
              : "Unknown error."}
          </span>
        </div>
      )}

      <form
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchDraft.trim());
          setPage(1);
        }}
      >
        <input
          type="search"
          placeholder="Search by name or email…"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          style={{
            flex: "1 1 240px",
            padding: "0.55rem 0.75rem",
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            color: "var(--foreground)",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as EmployeeStatus | "");
            setPage(1);
          }}
          style={{
            padding: "0.55rem 0.75rem",
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            color: "var(--foreground)",
          }}
        >
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABEL) as EmployeeStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button type="submit" className="btn" style={{ padding: "0.55rem 1rem" }}>
          Apply
        </button>
      </form>

      {roster.isLoading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading roster…</p>
      ) : roster.isError ? (
        <div className="card" style={{ borderColor: "rgba(220,38,38,0.3)" }}>
          <strong>Couldn&rsquo;t load the roster.</strong>{" "}
          <span style={{ color: "var(--text-muted)" }}>
            {roster.error instanceof Error ? roster.error.message : "Unknown error."}
          </span>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9375rem",
              }}
            >
              <thead style={{ background: "var(--background)", textAlign: "left" }}>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Department</Th>
                  <Th>Status</Th>
                  <Th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {roster.data!.results.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                      No employees match your filters yet.
                    </td>
                  </tr>
                ) : (
                  roster.data!.results.map((emp) => (
                    <tr key={emp.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <Td>{emp.full_name || `${emp.first_name} ${emp.last_name}`.trim()}</Td>
                      <Td style={{ color: "var(--text-muted)" }}>{emp.email}</Td>
                      <Td>{emp.department || "—"}</Td>
                      <Td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.125rem 0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            color: "#fff",
                            background: STATUS_COLOR[emp.status],
                          }}
                        >
                          {STATUS_LABEL[emp.status]}
                        </span>
                      </Td>
                      <Td style={{ textAlign: "right" }}>
                        {emp.status !== "offboarded" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Offboard ${emp.full_name}?`)) {
                                offboardMutation.mutate(emp.id);
                              }
                            }}
                            disabled={offboardMutation.isPending}
                            style={{
                              background: "none",
                              border: "1px solid var(--border)",
                              padding: "0.3125rem 0.625rem",
                              cursor: "pointer",
                              color: "var(--text-muted)",
                              fontSize: "0.8125rem",
                            }}
                          >
                            Offboard
                          </button>
                        )}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <span>{roster.data!.count} total</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                disabled={!roster.data!.previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={pagerBtn(!!roster.data!.previous)}
              >
                ← Prev
              </button>
              <button
                type="button"
                disabled={!roster.data!.next}
                onClick={() => setPage((p) => p + 1)}
                style={pagerBtn(!!roster.data!.next)}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...rest}
      style={{
        padding: "0.75rem 1rem",
        fontWeight: 600,
        fontSize: "0.8125rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  style,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...rest} style={{ padding: "0.75rem 1rem", ...style }}>
      {children}
    </td>
  );
}

function pagerBtn(enabled: boolean): React.CSSProperties {
  return {
    padding: "0.375rem 0.75rem",
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.5,
    color: "var(--foreground)",
  };
}

function formatImportError(err: { line?: number; email?: string; error: string }): string {
  const prefix = [
    err.line ? `Line ${err.line}` : null,
    err.email || null,
  ].filter(Boolean).join(" · ");

  return prefix ? `${prefix}: ${err.error}` : err.error;
}
