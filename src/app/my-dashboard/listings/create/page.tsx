"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/FormInput";
import { suggestMultiple, suggestPrice } from "@/lib/pricing";

type Listing = {
  id: string
  owner_id: string
  name: string
  description?: string
  industry: string
  subindustry?: string
  country?: string
  region?: string
  city?: string
  years_established?: number
  currency?: string
  revenue?: number | null
  profit?: number | null
  assets?: number | null
  asking_price?: number | null
  valuation_multiple?: number | null
  employees?: number | null
  customers?: number | null
  growth_rate?: number | null
  status: "draft" | "active" | "sold" | "withdrawn"
}

export default function CreateListingPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listingId, setListingId] = useState<string | null>(null)

  // Basic form state
  const [details, setDetails] = useState({
    name: "",
    industry: "",
    description: "",
    country: "",
    region: "",
    city: "",
    years_established: ""
  })

  const [financials, setFinancials] = useState({
    currency: "USD",
    revenue: "",
    profit: "",
    assets: "",
    asking_price: "",
    valuation_multiple: ""
  })

  const [ops, setOps] = useState({
    employees: "",
    customers: "",
    growth_rate: ""
  })

  const suggestedMultiple = useMemo(() =>
    suggestMultiple(details.industry, parseFloat(financials.profit || "0")),
  [details.industry, financials.profit])

  const suggestedPriceVal = useMemo(() =>
    suggestPrice({ industry: details.industry, profit: parseFloat(financials.profit || "0") }),
  [details.industry, financials.profit])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setError("You must be logged in to create a listing.")
      } else {
        setUserId(data.user.id)
      }
    })
  }, [])

  const ensureDraftListing = async () => {
    if (!userId) throw new Error("Not authenticated")
    if (listingId) return listingId
    if (!details.name || !details.industry) throw new Error("Name and industry are required")
    const { data, error } = await supabase
      .from("listings")
      .insert({
        owner_id: userId,
        name: details.name,
        industry: details.industry,
        description: details.description || null,
        country: details.country || null,
        region: details.region || null,
        city: details.city || null,
        years_established: details.years_established ? parseInt(details.years_established) : null,
        status: "draft",
        currency: financials.currency || "USD"
      })
      .select("id")
      .single()
    if (error) throw error
    setListingId(data!.id)
    try { localStorage.setItem('listingNewDraft', data!.id) } catch {}
    return data!.id
  }

  const saveDetails = async () => {
    setSaving(true); setError(null)
    try {
      const id = await ensureDraftListing()
      const { error } = await supabase.from("listings").update({
        name: details.name,
        industry: details.industry,
        description: details.description || null,
        country: details.country || null,
        region: details.region || null,
        city: details.city || null,
        years_established: details.years_established ? parseInt(details.years_established) : null,
      }).eq("id", id)
      if (error) throw error
      setStep(2)
    } catch (e: any) {
      setError(e.message || "Failed to save details")
    } finally { setSaving(false) }
  }

  const saveFinancials = async () => {
    if (!listingId) {
      // create if needed
      try { await ensureDraftListing() } catch (e: any) { setError(e.message); return }
    }
    setSaving(true); setError(null)
    try {
      const id = listingId!
      const profit = financials.profit ? parseFloat(financials.profit) : null
      const multiple = financials.valuation_multiple ? parseFloat(financials.valuation_multiple) : (suggestedMultiple ?? null)
      const asking = financials.asking_price ? parseFloat(financials.asking_price) : (suggestedPriceVal ?? null)
      const { error } = await supabase.from("listings").update({
        currency: financials.currency || "USD",
        revenue: financials.revenue ? parseFloat(financials.revenue) : null,
        profit,
        assets: financials.assets ? parseFloat(financials.assets) : null,
        valuation_multiple: multiple,
        asking_price: asking,
      }).eq("id", id)
      if (error) throw error
      setStep(3)
    } catch (e: any) {
      setError(e.message || "Failed to save financials")
    } finally { setSaving(false) }
  }

  const saveOps = async () => {
    if (!listingId) return
    setSaving(true); setError(null)
    try {
      const { error } = await supabase.from("listings").update({
        employees: ops.employees ? parseInt(ops.employees) : null,
        customers: ops.customers ? parseInt(ops.customers) : null,
        growth_rate: ops.growth_rate ? parseFloat(ops.growth_rate) : null,
      }).eq("id", listingId)
      if (error) throw error
      setStep(4)
    } catch (e: any) {
      setError(e.message || "Failed to save operations")
    } finally { setSaving(false) }
  }

  const [uploadBusy, setUploadBusy] = useState(false)
  const [photos, setPhotos] = useState<{ id: string; url?: string; storage_path: string }[]>([])
  const [docs, setDocs] = useState<{ id: string; file_name?: string; storage_path: string; status: string; doc_type: string }[]>([])

  const refreshAssets = async (id: string) => {
    const [{ data: p }, { data: d }] = await Promise.all([
      supabase.from("listing_photos").select("id, url, storage_path").eq("listing_id", id).order("position"),
      supabase.from("listing_documents").select("id, file_name, storage_path, status, doc_type").eq("listing_id", id).order("created_at", { ascending: false })
    ])
    setPhotos(p || [])
    setDocs(d || [])
  }

  const onUploadPhoto = async (file: File) => {
    if (!listingId || !userId) return
    setUploadBusy(true); setError(null)
    try {
      const path = `${userId}/${listingId}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from("listing-photos").upload(path, file, { upsert: false })
      if (upErr) throw upErr
      const publicUrl = supabase.storage.from("listing-photos").getPublicUrl(path).data.publicUrl
      const { error: insErr } = await supabase.from("listing_photos").insert({ listing_id: listingId, storage_path: path, url: publicUrl })
      if (insErr) throw insErr
      await refreshAssets(listingId)
    } catch (e: any) {
      setError(e.message || "Failed to upload photo")
    } finally { setUploadBusy(false) }
  }

  const [docType, setDocType] = useState("financial_statement")
  const onUploadDoc = async (file: File) => {
    if (!listingId || !userId) return
    setUploadBusy(true); setError(null)
    try {
      const path = `${userId}/${listingId}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage.from("listing-documents").upload(path, file, { upsert: false })
      if (upErr) throw upErr
      const { error: insErr } = await supabase.from("listing_documents").insert({
        listing_id: listingId,
        uploaded_by: userId,
        storage_path: path,
        file_name: file.name,
        file_size: file.size,
        doc_type: docType as any,
        status: "pending"
      })
      if (insErr) throw insErr
      await refreshAssets(listingId)
    } catch (e: any) {
      setError(e.message || "Failed to upload document")
    } finally { setUploadBusy(false) }
  }

  const [publishing, setPublishing] = useState(false)
  const publish = async () => {
    if (!listingId) return
    setPublishing(true); setError(null)
    try {
      // Optional: check publishable via RPC
      const { data: ok } = await supabase.rpc("listing_is_publishable", { p_listing_id: listingId })
      if (!ok) {
        setError("Please complete required fields before publishing (name, industry, description, asking price)")
        setPublishing(false)
        return
      }
      const { error } = await supabase.from("listings").update({ status: "active", published_at: new Date().toISOString() }).eq("id", listingId)
      if (error) throw error
      setStep(5)
      try { localStorage.removeItem('listingNewDraft') } catch {}
    } catch (e: any) {
      setError(e.message || "Failed to publish listing")
    } finally { setPublishing(false) }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create a Business Listing</h1>
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput id="name" name="name" label="Business Name" value={details.name}
              onChange={(e) => setDetails(d => ({ ...d, name: e.target.value }))} />
            <FormInput id="industry" name="industry" label="Industry" value={details.industry}
              onChange={(e) => setDetails(d => ({ ...d, industry: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                rows={5}
                value={details.description}
                onChange={(e) => setDetails(d => ({ ...d, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="country" name="country" label="Country" value={details.country}
                onChange={(e) => setDetails(d => ({ ...d, country: e.target.value }))} />
              <FormInput id="region" name="region" label="State/Region" value={details.region}
                onChange={(e) => setDetails(d => ({ ...d, region: e.target.value }))} />
              <FormInput id="city" name="city" label="City" value={details.city}
                onChange={(e) => setDetails(d => ({ ...d, city: e.target.value }))} />
            </div>
            <FormInput id="years_established" name="years_established" label="Years Established" value={details.years_established}
              onChange={(e) => setDetails(d => ({ ...d, years_established: e.target.value }))} />
          </CardContent>
          <CardFooter className="justify-between">
            <div />
            <button onClick={saveDetails} disabled={saving || !details.name || !details.industry}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50">
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="currency" name="currency" label="Currency (ISO)" value={financials.currency}
                onChange={(e) => setFinancials(f => ({ ...f, currency: e.target.value.toUpperCase() }))} />
              <FormInput id="revenue" name="revenue" label="Annual Revenue" value={financials.revenue}
                onChange={(e) => setFinancials(f => ({ ...f, revenue: e.target.value }))} />
              <FormInput id="profit" name="profit" label="Annual Profit" value={financials.profit}
                onChange={(e) => setFinancials(f => ({ ...f, profit: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="assets" name="assets" label="Assets" value={financials.assets}
                onChange={(e) => setFinancials(f => ({ ...f, assets: e.target.value }))} />
              <FormInput id="valuation_multiple" name="valuation_multiple" label="Valuation Multiple" value={financials.valuation_multiple}
                onChange={(e) => setFinancials(f => ({ ...f, valuation_multiple: e.target.value }))} />
              <FormInput id="asking_price" name="asking_price" label="Asking Price" value={financials.asking_price}
                onChange={(e) => setFinancials(f => ({ ...f, asking_price: e.target.value }))} />
            </div>
            <div className="text-sm text-gray-600">
              Suggested multiple: <strong>{suggestedMultiple ?? 'n/a'}</strong> · Suggested price: <strong>{suggestedPriceVal ?? 'n/a'}</strong>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 rounded-md border">Back</button>
            <button onClick={saveFinancials} disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50">
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="employees" name="employees" label="Employees" value={ops.employees}
                onChange={(e) => setOps(o => ({ ...o, employees: e.target.value }))} />
              <FormInput id="customers" name="customers" label="Customers" value={ops.customers}
                onChange={(e) => setOps(o => ({ ...o, customers: e.target.value }))} />
              <FormInput id="growth_rate" name="growth_rate" label="Growth Rate %" value={ops.growth_rate}
                onChange={(e) => setOps(o => ({ ...o, growth_rate: e.target.value }))} />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md border">Back</button>
            <button onClick={saveOps} disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50">
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
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
                <input type="file" accept="image/*" disabled={uploadBusy}
                  onChange={(e) => e.target.files && onUploadPhoto(e.target.files[0])} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map(p => (
                  <div key={p.id} className="border rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url || ''} alt="Photo" className="w-full h-32 object-cover" />
                    <div className="p-2 text-xs break-all">{p.storage_path}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-medium">Documents</h3>
                <select className="border rounded-md p-1 text-sm" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="financial_statement">Financial Statement</option>
                  <option value="tax_return">Tax Return</option>
                  <option value="legal_doc">Legal Doc</option>
                  <option value="other">Other</option>
                </select>
                <input type="file" disabled={uploadBusy}
                  onChange={(e) => e.target.files && onUploadDoc(e.target.files[0])} />
              </div>
              <ul className="space-y-2 text-sm">
                {docs.map(d => (
                  <li key={d.id} className="flex items-center justify-between border rounded-md p-2">
                    <span className="truncate mr-4">{d.file_name || d.storage_path}</span>
                    <span className="text-gray-600">{d.doc_type} · {d.status}</span>
                  </li>
                ))}
              </ul>
            </section>

          </CardContent>
          <CardFooter className="justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2 rounded-md border">Back</button>
            <button onClick={() => setStep(5)} className="px-4 py-2 rounded-md bg-blue-600 text-white">Review</button>
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
              <div className="font-medium whitespace-pre-wrap">{details.description}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Asking Price</div>
              <div className="font-medium">{financials.currency} {financials.asking_price || suggestedPriceVal || 'n/a'}</div>
            </div>
            <div className="text-sm text-gray-600">Photos: {photos.length} · Documents: {docs.length}</div>
          </CardContent>
          <CardFooter className="justify-between">
            <button onClick={() => setStep(4)} className="px-4 py-2 rounded-md border">Back</button>
            <button onClick={publish} disabled={publishing || !listingId}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-50">
              {publishing ? 'Publishing...' : 'Publish Listing'}
            </button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
