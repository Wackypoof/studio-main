'use server';

import { summarizeListing, type SummarizeListingInput } from '@/ai/flows/listing-summary-gen-ai';
import { z } from 'zod';

const ActionInputSchema = z.object({
  headline: z.string(),
  teaser: z.string(),
  revenue_t12m: z.number(),
  profit_t12m: z.number(),
  asking_price: z.number(),
  assets_summary: z.string(),
  licences_summary: z.string(),
  staff_count: z.number(),
  lease_summary: z.string(),
  vertical: z.string(),
  location_area: z.string(),
});

export async function generateListingSummary(input: SummarizeListingInput) {
  const parsedInput = ActionInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for generating summary.');
  }

  try {
    const result = await summarizeListing(parsedInput.data);
    return result.summary;
  } catch (error) {
    console.error('Error generating listing summary:', error);
    return 'An error occurred while generating the analysis. Please try again later.';
  }
}
