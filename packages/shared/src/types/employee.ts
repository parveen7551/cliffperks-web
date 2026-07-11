import type { ISODate, UUID } from "./common";

export type EmployeeStatus = "invited" | "active" | "suspended" | "offboarded";
export type LangPref = "en" | "fr";

/** Mirrors apps.employees.serializers.EmployeeSerializer. */
export interface Employee {
  id: UUID;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  department: string;
  location: string;
  lang_pref: LangPref;
  status: EmployeeStatus;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface EmployeeImportError {
  line?: number;
  email?: string;
  error: string;
}

/** Response shape from POST /employers/me/employees. */
export interface EmployeeImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: EmployeeImportError[];
}
