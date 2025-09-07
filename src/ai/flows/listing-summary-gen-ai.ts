'use server';

/**
 * @fileOverview Generates a summary of a business listing, highlighting key financial data and potential risks and opportunities.
 *
 * - summarizeListing - A function that generates the summary.
 * - SummarizeListingInput - The input type for the summarizeListing function.
 * - SummarizeListingOutput - The return type for the summarizeListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeListingInputSchema = z.object({
  headline: z.string().describe('The headline of the listing.'),
  teaser: z.string().describe('A short teaser description of the listing.'),
  revenue_t12m: z.number().describe('The revenue of the business in the last 12 months.'),
  profit_t12m: z.number().describe('The profit of the business in the last 12 months.'),
  asking_price: z.number().describe('The asking price for the business.'),
  assets_summary: z.string().describe('A summary of the assets included in the sale.'),
  licences_summary: z.string().describe('A summary of the licenses held by the business.'),
  staff_count: z.number().describe('The number of staff employed by the business.'),
  lease_summary: z.string().describe('A summary of the lease terms for the business premises.'),
  vertical: z.string().describe('The industry vertical of the business.'),
  location_area: z.string().describe('The location area of the business.'),
});
export type SummarizeListingInput = z.infer<typeof SummarizeListingInputSchema>;

const SummarizeListingOutputSchema = z.object({
  summary: z.string().describe('A detailed summary of the business listing, including key financial data, potential risks, and opportunities.'),
});
export type SummarizeListingOutput = z.infer<typeof SummarizeListingOutputSchema>;

export async function summarizeListing(input: SummarizeListingInput): Promise<SummarizeListingOutput> {
  return summarizeListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeListingPrompt',
  input: {schema: SummarizeListingInputSchema},
  output: {schema: SummarizeListingOutputSchema},
  prompt: `You are an expert business analyst.  You are reviewing a business listing with the following details.

Headline: {{{headline}}}
Teaser: {{{teaser}}}
Revenue (T12M): {{{revenue_t12m}}}
Profit (T12M): {{{profit_t12m}}}
Asking Price: {{{asking_price}}}
Assets Summary: {{{assets_summary}}}
Licences Summary: {{{licences_summary}}}
Staff Count: {{{staff_count}}}
Lease Summary: {{{lease_summary}}}
Vertical: {{{vertical}}}
Location Area: {{{location_area}}}

Generate a detailed summary of the business listing, including key financial data, potential risks, and opportunities for a potential buyer. Focus on aspects that would be most relevant to a buyer's decision-making process.`, 
});

const summarizeListingFlow = ai.defineFlow(
  {
    name: 'summarizeListingFlow',
    inputSchema: SummarizeListingInputSchema,
    outputSchema: SummarizeListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
