"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleAwareButton } from "@/components/dashboard/RoleAwareButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { suggestMultiple, suggestPrice } from "@/lib/pricing";
import { useAuth } from "@/context/AuthProvider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function CreateListingPage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string | null>(null);

  // Basic form state
  const [details, setDetails] = useState({
    name: "",
    industry: "",
    description: "",
    country: "",
    region: "",
    city: "",
    years_established: "",
  });

  const [financials, setFinancials] = useState({
    currency: "USD",
    revenue: "",
    profit: "",
    assets: "",
    asking_price: "",
    valuation_multiple: "",
  });

  const [ops, setOps] = useState({
    employees: "",
    customers: "",
    growth_rate: "",
  });

  const [autoCalcMultiple, setAutoCalcMultiple] = useState(true);
  const [autoCalcPrice, setAutoCalcPrice] = useState(true);

  // Options
  const [countryOptions, setCountryOptions] = useState<
    { code: string; name: string }[]
  >([]);
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const regions = (Intl as any).supportedValuesOf?.("region") || [];
      if (regions.length) {
        const dn = new Intl.DisplayNames(["en"], { type: "region" });
        const opts = regions
          .map((code: string) => ({ code, name: dn.of(code) || code }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountryOptions(opts);
      } else {
        setCountryOptions([
          { code: "SG", name: "Singapore" },
          { code: "MY", name: "Malaysia" },
          { code: "ID", name: "Indonesia" },
          { code: "TH", name: "Thailand" },
          { code: "VN", name: "Vietnam" },
          { code: "PH", name: "Philippines" },
          { code: "US", name: "United States" },
          { code: "GB", name: "United Kingdom" },
          { code: "CN", name: "China" },
          { code: "IN", name: "India" },
        ]);
      }
    } catch {
      setCountryOptions([{ code: "SG", name: "Singapore" }]);
    }

    try {
      const currencies = (Intl as any).supportedValuesOf?.("currency") || [];
      if (currencies.length) setCurrencyOptions(currencies);
      else
        setCurrencyOptions([
          "USD",
          "SGD",
          "MYR",
          "THB",
          "VND",
          "PHP",
          "EUR",
          "GBP",
          "JPY",
          "CNY",
        ]);
    } catch {
      setCurrencyOptions(["USD", "SGD", "EUR", "GBP"]);
    }
  }, []);

  // Prefer deriving multiple from Asking Price / Revenue when user has keyed them in
  const suggestedMultiple = useMemo(() => {
    const rev = parseFloat(financials.revenue || "0");
    const ask = parseFloat(financials.asking_price || "0");
    if (rev > 0 && ask > 0) return +(ask / rev).toFixed(2);
    // Fallback to industry-based suggestion if revenue/asking not provided
    return suggestMultiple(details.industry, parseFloat(financials.profit || "0"));
  }, [financials.revenue, financials.asking_price, details.industry, financials.profit]);

  const suggestedPriceVal = useMemo(
    () =>
      suggestPrice({
        industry: details.industry,
        profit: parseFloat(financials.profit || "0"),
      }),
    [details.industry, financials.profit]
  );

  // Auto-calc fields based on toggles
  useEffect(() => {
    if (!autoCalcMultiple) return;

    setFinancials((prev) => {
      const revenueValue = parseFloat(prev.revenue || "0");
      const askingValue = parseFloat(prev.asking_price || "0");
      let multiple: number | null = null;
      const profitValue = parseFloat(prev.profit || "0");
      if (revenueValue > 0 && askingValue > 0) {
        multiple = +(askingValue / revenueValue).toFixed(2);
      } else {
        multiple = suggestMultiple(details.industry, profitValue);
      }
      const nextValue = multiple != null ? String(multiple) : prev.valuation_multiple;
      if (nextValue === prev.valuation_multiple) {
        return prev;
      }
      return {
        ...prev,
        valuation_multiple: nextValue,
      };
    });
  }, [autoCalcMultiple, details.industry]);

  useEffect(() => {
    if (!autoCalcPrice) return;

    setFinancials((prev) => {
      const profitValue = parseFloat(prev.profit || "0");
      const price = suggestPrice({
        industry: details.industry,
        profit: profitValue,
      });
      const nextValue = price != null ? String(price) : prev.asking_price;
      if (nextValue === prev.asking_price) {
        return prev;
      }
      return {
        ...prev,
        asking_price: nextValue,
      };
    });
  }, [autoCalcPrice, details.industry]);

  // Helper to prevent indefinite loading if a request stalls
  const withTimeout = async <T,>(
    promise: PromiseLike<T>,
    ms = 12000,
    label = "request"
  ): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    });
    try {
      // Race the promise against a timeout to avoid hanging UI
      return await Promise.race([Promise.resolve(promise), timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const ensureDraftListing = async () => {
    if (!userId) throw new Error("Not authenticated");
    if (listingId) return listingId;
    if (!details.name || !details.industry)
      throw new Error("Name and industry are required");
    // Fire-and-forget: ensure a matching profile row exists to satisfy FK constraint.
    // Avoid awaiting this call to prevent hangs if RPC is slow/unavailable.
    try {
      void Promise.resolve(
        supabase.rpc("ensure_profile_exists", { user_id: userId })
      ).catch((e: unknown) =>
        console.warn("ensure_profile_exists RPC failed (continuing):", e)
      );
    } catch {}
    const payload = {
      owner_id: userId,
      name: details.name,
      industry: details.industry,
      description: details.description || null,
      country: details.country || null,
      region: details.region || null,
      city: details.city || null,
      years_established: details.years_established
        ? parseInt(details.years_established)
        : null,
      status: "draft" as const,
    };
    const { data, error } = await withTimeout(
      supabase
        .from("listings")
        .insert(payload)
        .select("id")
        .single(),
      15000,
      "create listing"
    );
    if (error) {
      console.error("Create listing failed:", { payload, error });
      throw error;
    }
    setListingId(data!.id);
    try {
      localStorage.setItem("listingNewDraft", data!.id);
    } catch {}
    return data!.id;
  };

  const saveDetails = async () => {
    setSaving(true);
    setError(null);
    try {
      const id = await ensureDraftListing();
      const { error } = await withTimeout(
        supabase
          .from("listings")
          .update({
            name: details.name,
            industry: details.industry,
            description: details.description || null,
            country: details.country || null,
            region: details.region || null,
            city: details.city || null,
            years_established: details.years_established
              ? parseInt(details.years_established)
              : null,
          })
          .eq("id", id),
        12000,
        "save details"
      );
      if (error) throw error;
      setStep(2);
    } catch (e: any) {
      const msg = e?.message || "Failed to save details";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const saveFinancials = async () => {
    let id = listingId;
    if (!id) {
      // Create draft if needed and use the returned id immediately
      try {
        id = await ensureDraftListing();
      } catch (e: any) {
        setError(e.message || "Failed to create draft listing");
        return;
      }
    }
    setSaving(true);
    setError(null);
    try {
      const useId = id!;
      const profit = financials.profit ? parseFloat(financials.profit) : null;
      const multiple = financials.valuation_multiple
        ? parseFloat(financials.valuation_multiple)
        : suggestedMultiple ?? null;
      const asking = financials.asking_price
        ? parseFloat(financials.asking_price)
        : suggestedPriceVal ?? null;
      const fiscalYear = new Date().getFullYear();
      const { error } = await withTimeout(
        supabase
          .from("listing_financials")
          .upsert(
            {
              listing_id: useId,
              fiscal_year: fiscalYear,
              currency: financials.currency || "USD",
              revenue: financials.revenue ? parseFloat(financials.revenue) : null,
              profit,
              assets: financials.assets ? parseFloat(financials.assets) : null,
              valuation_multiple: multiple,
              asking_price: asking,
            },
            { onConflict: "listing_id,fiscal_year" }
          ),
        12000,
        "save financials"
      );
      if (error) throw error;
      setStep(3);
    } catch (e: any) {
      setError(e.message || "Failed to save financials");
    } finally {
      setSaving(false);
    }
  };

  const saveOps = async () => {
    if (!listingId) return;
    setSaving(true);
    setError(null);
    try {
      // Save operational metrics on listings table
      const { error } = await withTimeout(
        supabase
          .from("listings")
          .update({
            employees: ops.employees ? parseInt(ops.employees) : null,
            customers: ops.customers ? parseInt(ops.customers) : null,
          })
          .eq("id", listingId),
        12000,
        "save operations"
      );
      if (error) throw error;
      // Save growth rate in listing_financials (current fiscal year)
      const fiscalYear = new Date().getFullYear();
      const { error: finErr } = await withTimeout(
        supabase
          .from("listing_financials")
          .upsert(
            {
              listing_id: listingId,
              fiscal_year: fiscalYear,
              growth_rate: ops.growth_rate
                ? parseFloat(ops.growth_rate)
                : null,
            },
            { onConflict: "listing_id,fiscal_year" }
          ),
        12000,
        "save growth rate"
      );
      if (finErr) throw finErr;
      setStep(4);
    } catch (e: any) {
      setError(e.message || "Failed to save operations");
    } finally {
      setSaving(false);
    }
  };

  const [uploadBusy, setUploadBusy] = useState(false);
  const [photos, setPhotos] = useState<
    { id: string; url: string | null; storage_path: string }[]
  >([]);
  const [docs, setDocs] = useState<
    {
      id: string;
      file_name: string | null;
      storage_path: string;
      status: Database["public"]["Enums"]["document_status"];
      doc_type: Database["public"]["Enums"]["document_type"];
    }[]
  >([]);

  const refreshAssets = async (id: string) => {
    const [{ data: p }, { data: d }] = await Promise.all([
      supabase
        .from("listing_photos")
        .select("id, url, storage_path")
        .eq("listing_id", id)
        .order("position"),
      supabase
        .from("listing_documents")
        .select("id, file_name, storage_path, status, doc_type")
        .eq("listing_id", id)
        .order("created_at", { ascending: false }),
    ]);
    setPhotos(p || []);
    setDocs(d || []);
  };

  const onUploadPhoto = async (file: File) => {
    if (!listingId || !userId) return;
    setUploadBusy(true);
    setError(null);
    try {
      const path = `${userId}/${listingId}/${Date.now()}_${file.name}`;
      const { error: upErr } = await withTimeout(
        supabase.storage
          .from("listing-photos")
          .upload(path, file, { upsert: false }),
        20000,
        "upload photo"
      );
      if (upErr) throw upErr;
      const publicUrl = supabase.storage
        .from("listing-photos")
        .getPublicUrl(path).data.publicUrl;
      const { error: insErr } = await withTimeout(
        supabase
          .from("listing_photos")
          .insert({ listing_id: listingId, storage_path: path, url: publicUrl }),
        12000,
        "record photo"
      );
      if (insErr) throw insErr;
      await refreshAssets(listingId);
    } catch (e: any) {
      setError(e.message || "Failed to upload photo");
    } finally {
      setUploadBusy(false);
    }
  };
  const [docType, setDocType] = useState<
    Database["public"]["Enums"]["document_type"]
  >("financial_statement");
  const onUploadDoc = async (file: File) => {
    if (!listingId || !userId) return;
    setUploadBusy(true);
    setError(null);
    try {
      const path = `${userId}/${listingId}/${Date.now()}_${file.name}`;
      const { error: upErr } = await withTimeout(
        supabase.storage
          .from("listing-documents")
          .upload(path, file, { upsert: false }),
        20000,
        "upload document"
      );
      if (upErr) throw upErr;
      const { error: insErr } = await withTimeout(
        supabase
          .from("listing_documents")
          .insert({
            listing_id: listingId,
            uploaded_by: userId,
            storage_path: path,
            file_name: file.name,
            file_size: file.size,
            doc_type: docType,
            status: "pending",
          }),
        12000,
        "record document"
      );
      if (insErr) throw insErr;
      await refreshAssets(listingId);
    } catch (e: any) {
      setError(e.message || "Failed to upload document");
    } finally {
      setUploadBusy(false);
    }
  };

  const [publishing, setPublishing] = useState(false);
  const publish = async () => {
    if (!listingId) return;
    setPublishing(true);
    setError(null);
    try {
      const { data: ok } = await withTimeout(
        supabase.rpc("listing_is_publishable", {
          p_listing_id: listingId,
        }),
        10000,
        "validate publish"
      );
      if (!ok) {
        setError(
          "Please complete required fields before publishing (name, industry, description, asking price)"
        );
        setPublishing(false);
        return;
      }
      const { error } = await withTimeout(
        supabase
          .from("listings")
          .update({ status: "active", published_at: new Date().toISOString() })
          .eq("id", listingId),
        12000,
        "publish listing"
      );
      if (error) throw error;
      setStep(5);
      try {
        localStorage.removeItem("listingNewDraft");
      } catch {}
    } catch (e: any) {
      setError(e.message || "Failed to publish listing");
    } finally {
      setPublishing(false);
    }
  };

  const steps = ["Details", "Financials", "Operations", "Assets", "Review"];
  const progress = Math.round(((step - 1) / (steps.length - 1)) * 100);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Create Listing"
        description="Add business details, financials, and documents, then publish."
      />
      <div className="space-y-2">
        <Progress value={progress} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {steps.map((label, i) => (
            <span
              key={label}
              className={i + 1 === step ? "font-medium text-foreground" : ""}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  required
                  value={details.name}
                  onChange={(e) =>
                    setDetails((d) => ({ ...d, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  list="industry-list"
                  value={details.industry}
                  onChange={(e) =>
                    setDetails((d) => ({ ...d, industry: e.target.value }))
                  }
                />
                <datalist id="industry-list">
                  <option value="SaaS" />
                  <option value="E-commerce" />
                  <option value="Content/Media" />
                  <option value="Professional Services" />
                  <option value="Manufacturing" />
                  <option value="Healthcare" />
                  <option value="Education" />
                  <option value="F&B" />
                </datalist>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={details.description}
                onChange={(e) =>
                  setDetails((d) => ({ ...d, description: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  list="country-list"
                  value={details.country}
                  onChange={(e) =>
                    setDetails((d) => ({ ...d, country: e.target.value }))
                  }
                  placeholder="Start typing…"
                />
                <datalist id="country-list">
                  {countryOptions.map((c) => (
                    <option key={c.code} value={c.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">State/Region</Label>
                <Input
                  id="region"
                  value={details.region}
                  onChange={(e) =>
                    setDetails((d) => ({ ...d, region: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={details.city}
                  onChange={(e) =>
                    setDetails((d) => ({ ...d, city: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2 md:max-w-xs">
              <Label htmlFor="years_established">Years Established</Label>
              <Input
                id="years_established"
                value={details.years_established}
                onChange={(e) =>
                  setDetails((d) => ({
                    ...d,
                    years_established: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div />
            <RoleAwareButton
              onClick={saveDetails}
              disabled={saving || !details.name || !details.industry}
            >
              {saving ? "Saving…" : "Save & Continue"}
            </RoleAwareButton>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency (ISO)</Label>
                <Input
                  id="currency"
                  list="currency-list"
                  value={financials.currency}
                  onChange={(e) =>
                    setFinancials((f) => ({
                      ...f,
                      currency: e.target.value.toUpperCase(),
                    }))
                  }
                />
                <datalist id="currency-list">
                  {currencyOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue</Label>
                <Input
                  id="revenue"
                  value={financials.revenue}
                  onChange={(e) =>
                    setFinancials((f) => ({ ...f, revenue: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit">Annual Profit</Label>
                <Input
                  id="profit"
                  value={financials.profit}
                  onChange={(e) =>
                    setFinancials((f) => ({ ...f, profit: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="assets">Assets</Label>
                <Input
                  id="assets"
                  value={financials.assets}
                  onChange={(e) =>
                    setFinancials((f) => ({ ...f, assets: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="valuation_multiple">Valuation Multiple</Label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={autoCalcMultiple}
                      onChange={(e) => setAutoCalcMultiple(e.target.checked)}
                    />{" "}
                    Auto
                  </label>
                </div>
                <Input
                  id="valuation_multiple"
                  disabled={autoCalcMultiple}
                  value={financials.valuation_multiple}
                  onChange={(e) =>
                    setFinancials((f) => ({
                      ...f,
                      valuation_multiple: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="asking_price">Asking Price</Label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={autoCalcPrice}
                      onChange={(e) => setAutoCalcPrice(e.target.checked)}
                    />{" "}
                    Auto
                  </label>
                </div>
                <Input
                  id="asking_price"
                  disabled={autoCalcPrice}
                  value={financials.asking_price}
                  onChange={(e) =>
                    setFinancials((f) => ({
                      ...f,
                      asking_price: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Suggested multiple:{" "}
              <span className="font-medium">{suggestedMultiple ?? "n/a"}</span>{" "}
              · Suggested price:{" "}
              <span className="font-medium">{suggestedPriceVal ?? "n/a"}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <RoleAwareButton onClick={saveFinancials} disabled={saving}>
              {saving ? "Saving…" : "Save & Continue"}
            </RoleAwareButton>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="employees">Employees</Label>
                <Input
                  id="employees"
                  value={ops.employees}
                  onChange={(e) =>
                    setOps((o) => ({ ...o, employees: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customers">Customers</Label>
                <Input
                  id="customers"
                  value={ops.customers}
                  onChange={(e) =>
                    setOps((o) => ({ ...o, customers: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="growth_rate">Growth Rate %</Label>
                <Input
                  id="growth_rate"
                  value={ops.growth_rate}
                  onChange={(e) =>
                    setOps((o) => ({ ...o, growth_rate: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <RoleAwareButton onClick={saveOps} disabled={saving}>
              {saving ? "Saving…" : "Save & Continue"}
            </RoleAwareButton>
          </CardFooter>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents & Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Photos</h3>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadBusy}
                  onChange={(e) =>
                    e.target.files && onUploadPhoto(e.target.files[0])
                  }
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((p) => (
                  <div key={p.id} className="border rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url || ""}
                      alt="Photo"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 text-xs break-all">
                      {p.storage_path}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-medium">Documents</h3>
                <select
                  className="border-input bg-background text-sm rounded-md p-2"
                  value={docType}
                  onChange={(e) =>
                    setDocType(
                      e.target
                        .value as Database["public"]["Enums"]["document_type"]
                    )
                  }
                >
                  <option value="financial_statement">
                    Financial Statement
                  </option>
                  <option value="tax_return">Tax Return</option>
                  <option value="legal_doc">Legal Doc</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="file"
                  disabled={uploadBusy}
                  onChange={(e) =>
                    e.target.files && onUploadDoc(e.target.files[0])
                  }
                />
              </div>
              <ul className="space-y-2 text-sm">
                {docs.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between border rounded-md p-2"
                  >
                    <span className="truncate mr-4">
                      {d.file_name || d.storage_path}
                    </span>
                    <span className="text-gray-600">
                      {d.doc_type} · {d.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <RoleAwareButton onClick={() => setStep(5)}>Review</RoleAwareButton>
          </CardFooter>
        </Card>
      )}

      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview & Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium">{details.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Industry</div>
              <div className="font-medium">{details.industry}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Description</div>
              <div className="font-medium whitespace-pre-wrap">
                {details.description}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Asking Price</div>
              <div className="font-medium">
                {financials.currency}{" "}
                {financials.asking_price || suggestedPriceVal || "n/a"}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Photos: {photos.length} · Documents: {docs.length}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep(4)}>
              Back
            </Button>
            <RoleAwareButton onClick={publish} disabled={publishing || !listingId}>
              {publishing ? "Publishing…" : "Publish Listing"}
            </RoleAwareButton>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
