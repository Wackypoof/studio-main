"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useFormAutosave } from '@/hooks/useFormValidation';

type Draft = {
  headline: string;
  vertical: string;
  location_area: string;
  asking_price: string;
  teaser: string;
};

const STORAGE_KEY = 'listingNewDraft';

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState<Draft>({
    headline: '',
    vertical: '',
    location_area: '',
    asking_price: '',
    teaser: '',
  });

  const { lastSavedAt, hasDraft, restore, clear, saveNow } = useFormAutosave<Draft>({ storageKey: STORAGE_KEY, data: form });

  // Restore saved draft on first mount
  useEffect(() => {
    const restored = restore();
    if (restored) setForm(restored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = useMemo(() => {
    const s1 = !!(form.headline && form.vertical && form.location_area);
    const s2 = !!(form.asking_price && Number(form.asking_price) > 0);
    const s3 = (form.teaser?.trim().length || 0) >= 50;
    const s4 = s1 && s2 && s3;
    return [
      { key: 'info', label: 'Business info', done: s1 },
      { key: 'financials', label: 'Financials', done: s2 },
      { key: 'highlights', label: 'Highlights', done: s3 },
      { key: 'review', label: 'Review', done: s4 },
    ];
  }, [form]);

  const progress = Math.round((steps.filter(s => s.done).length / steps.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/listings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Listing</h1>
          <p className="text-sm text-muted-foreground">Draft is autosaved locally as you type</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {lastSavedAt ? `Autosaved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved yet'}
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Listing builder</CardTitle>
              <CardDescription>Fill out the basic details to start your draft</CardDescription>
            </div>
            {hasDraft && (
              <Badge variant="secondary">Draft detected</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Progress value={progress} className="w-full" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{progress}%</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {steps.map(step => (
              <div key={step.key} className="flex items-center gap-2">
                {step.done ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                <span className={step.done ? 'line-through text-muted-foreground' : ''}>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <Input value={form.headline} onChange={(e) => setForm(prev => ({ ...prev, headline: e.target.value }))} placeholder="e.g. Profitable SaaS with 1.2k MRR" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">Vertical</label>
                <Input value={form.vertical} onChange={(e) => setForm(prev => ({ ...prev, vertical: e.target.value }))} placeholder="e.g. SaaS, E-commerce" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input value={form.location_area} onChange={(e) => setForm(prev => ({ ...prev, location_area: e.target.value }))} placeholder="e.g. Singapore / Remote" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Asking price (USD)</label>
                <Input type="number" value={form.asking_price} onChange={(e) => setForm(prev => ({ ...prev, asking_price: e.target.value }))} placeholder="e.g. 500000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teaser (min 50 chars)</label>
              <Textarea value={form.teaser} onChange={(e) => setForm(prev => ({ ...prev, teaser: e.target.value }))} placeholder="Short summary that highlights what makes this business attractive" rows={5} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => saveNow()}>Save now</Button>
            <Button variant="outline" onClick={() => { clear(); }}>Clear draft</Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/listings">Cancel</Link>
            </Button>
            <div className="ml-auto">
              <Button disabled={progress < 50} onClick={() => router.push('/dashboard/listings')}>Continue</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

