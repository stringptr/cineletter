"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Search,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

/* =======================
   TYPES
======================= */

type DatabaseRole = {
  type: string; // "data"
  is_active: boolean;
};

type CompanyRole = {
  company_id: number;
  company_name: string;
  type: "executive" | "marketing";
  is_active: boolean;
};

type RoleResponse = {
  database: DatabaseRole[];
  company: CompanyRole[];
};

type RoleValue = "" | "executive" | "marketing" | "data";

/* =======================
   COMPONENT
======================= */

export default function SelectContextPage() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------- STATE ---------- */
  const [roles, setRoles] = useState<RoleResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState<RoleValue>("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyRole | null>(
    null,
  );

  const [companySearch, setCompanySearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    fetch("/api/auth/role")
      .then((r) => r.json())
      .then((data: RoleResponse) => setRoles(data))
      .catch(() => {
        setRoles({ database: [], company: [] });
        router.replace("/");
        router.refresh();
      });
  }, []);

  /* ---------- DERIVED DATA ---------- */
  const companyRoles = useMemo(
    () => roles?.company.filter((c) => c.is_active) ?? [],
    [roles],
  );

  const databaseRoles = useMemo(
    () => roles?.database.filter((d) => d.is_active) ?? [],
    [roles],
  );

  const filteredCompanies = useMemo(() => {
    if (!companySearch) return companyRoles;
    return companyRoles.filter((c) =>
      c.company_name.toLowerCase().includes(companySearch.toLowerCase())
    );
  }, [companySearch, companyRoles]);

  const companyDropdownDisabled = selectedRole === "data";

  /* ---------- OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- HANDLERS ---------- */

  const handleRoleChange = (role: RoleValue) => {
    setSelectedRole(role);

    // Database role → no company
    if (role === "data") {
      setSelectedCompany(null);
      setCompanySearch("");
      return;
    }

    // Company role → ensure valid company
    const fallback = companyRoles.find((c) => c.type === role);
    if (!selectedCompany || selectedCompany.type !== role) {
      setSelectedCompany(fallback ?? null);
      setCompanySearch(fallback?.company_name ?? "");
    }
  };

  const handleSelectCompany = (company: CompanyRole) => {
    setSelectedCompany(company);
    setCompanySearch(company.company_name);
    setDropdownOpen(false);
    setSelectedRole(company.type); // auto-sync role
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    setLoading(true);

    setTimeout(() => {
      if (selectedRole === "data") {
        router.push(`/dashboard/database/${selectedRole}`);
        return;
      }

      if (selectedCompany) {
        router.push(
          `/dashboard/company/${selectedCompany.company_id}/${selectedRole}`,
        );
      }
    }, 600);
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121212]/90 border border-white/10 rounded-2xl p-8">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <ShieldCheck className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Select Context</h1>
          <p className="text-sm text-gray-400">
            Choose role & workspace
          </p>
        </div>

        {/* ROLE */}
        <div className="space-y-2 mb-6">
          <label className="text-xs text-gray-500 uppercase flex gap-2">
            <UserCircle className="w-3 h-3" /> Role
          </label>

          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value as RoleValue)}
              className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3 appearance-none"
            >
              <option value="" disabled>
                Select role…
              </option>

              {companyRoles.length > 0 && (
                <optgroup label="Company">
                  {companyRoles.some((r) => r.type === "executive") && (
                    <option value="executive">Executive</option>
                  )}
                  {companyRoles.some((r) => r.type === "marketing") && (
                    <option value="marketing">Marketing</option>
                  )}
                </optgroup>
              )}

              {databaseRoles.length > 0 && (
                <optgroup label="Database">
                  <option value="data">Data</option>
                </optgroup>
              )}
            </select>

            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* COMPANY */}
        <div className="space-y-2 mb-8" ref={dropdownRef}>
          <label className="text-xs text-gray-500 uppercase flex gap-2">
            <Building2 className="w-3 h-3" /> Workspace
          </label>

          <div className="relative">
            <input
              disabled={companyDropdownDisabled}
              value={companySearch}
              placeholder={companyDropdownDisabled
                ? "Database role selected"
                : "Search company…"}
              onChange={(e) => {
                setCompanySearch(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => !companyDropdownDisabled && setDropdownOpen(true)}
              className={`w-full bg-black border border-white/10 rounded-lg pl-10 pr-10 py-3 text-sm ${
                companyDropdownDisabled
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-white"
              }`}
            />

            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-500" />

            {dropdownOpen && !companyDropdownDisabled && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg max-h-60 overflow-y-auto z-50">
                {filteredCompanies.length
                  ? (
                    filteredCompanies.map((c) => (
                      <div
                        key={`${c.company_id}-${c.type}`}
                        onClick={() => handleSelectCompany(c)}
                        className="px-4 py-3 text-sm text-gray-300 hover:bg-white/10 cursor-pointer"
                      >
                        {c.company_name.trim()}
                        <span className="ml-2 text-xs text-gray-500">
                          ({c.type})
                        </span>
                      </div>
                    ))
                  )
                  : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No company found
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* CONTINUE */}
        <button
          disabled={loading ||
            !selectedRole ||
            (selectedRole !== "data" && !selectedCompany)}
          onClick={handleContinue}
          className="w-full bg-white text-black font-bold py-3 rounded-lg disabled:bg-gray-800 disabled:text-gray-500"
        >
          {loading ? "Loading…" : "Enter Dashboard"}
        </button>
      </div>
    </div>
  );
}
