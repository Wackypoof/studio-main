import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';
import type { Database } from '@/types/db';
import type {
  BuyerDashboardActivityItem,
  BuyerDashboardSummaryResponse,
  DashboardVerificationStatus,
} from '@/types/dashboard';

const RECENT_ACTIVITY_LIMIT = 5;
const ACTIVE_OFFER_STATUSES: Database['public']['Enums']['offer_status'][] = ['pending', 'accepted'];
const BUYER_VERIFICATION_DOC_TYPES = ['identity', 'proof_of_funds'] as const;

type SupabaseServerClient = SupabaseClient<Database>;

type SavedListingsSummary = {
  total: number;
  activity: BuyerDashboardActivityItem[];
};

type NdaSummary = {
  activeCount: number;
  activity: BuyerDashboardActivityItem[];
};

type OfferSummary = {
  activeCount: number;
  activity: BuyerDashboardActivityItem[];
};

type ConversationSummary = {
  unreadCount: number;
  activity: BuyerDashboardActivityItem[];
};

let serviceClient: SupabaseServerClient | null = null;

const getServiceClient = () => {
  if (!serviceClient) {
    serviceClient = createServiceRoleClient();
  }
  return serviceClient;
};

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [savedSummary, ndaSummary, offerSummary, conversationSummary, verificationStatus] =
      await Promise.all([
        fetchSavedListingsSummary(supabase, user.id),
        fetchNdaSummary(user.id),
        fetchOfferSummary(supabase, user.id),
        fetchConversationSummary(supabase, user.id),
        fetchVerificationStatus(supabase, user),
      ]);

    const recentActivity = [...savedSummary.activity, ...ndaSummary.activity, ...offerSummary.activity, ...conversationSummary.activity]
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, RECENT_ACTIVITY_LIMIT);

    const payload: BuyerDashboardSummaryResponse = {
      stats: {
        savedListings: savedSummary.total,
        activeNdas: ndaSummary.activeCount,
        activeOffers: offerSummary.activeCount,
        unreadMessages: conversationSummary.unreadCount,
      },
      recentActivity,
      verificationStatus,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Failed to load buyer dashboard summary:', error);
    return NextResponse.json(
      { error: 'Failed to load buyer dashboard data' },
      { status: 500 },
    );
  }
}

async function fetchSavedListingsSummary(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<SavedListingsSummary> {
  try {
    const [{ count, error: countError }, { data, error }] = await Promise.all([
      supabase
        .from('buyer_saved_listings')
        .select('id', { count: 'exact', head: true })
        .eq('buyer_id', userId),
      supabase
        .from('buyer_saved_listings')
        .select(
          `
            listing_id,
            created_at,
            listing:listings (
              id,
              name
            )
          `,
        )
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })
        .limit(RECENT_ACTIVITY_LIMIT),
    ]);

    if (countError) throw countError;
    if (error) throw error;

    const activity: BuyerDashboardActivityItem[] = (data ?? [])
      .filter((row): row is typeof row & { listing: { name: string | null } } => Boolean(row.listing))
      .map((row) => ({
        id: `saved-${row.listing_id}`,
        type: 'saved_listing',
        title: row.listing?.name ?? 'Saved listing',
        subtitle: 'Saved listing',
        timestamp: row.created_at,
        href: '/dashboard/saved-listings',
      }));

    return {
      total: count ?? activity.length,
      activity,
    };
  } catch (error) {
    console.error('Failed to load saved listings summary:', error);
    return { total: 0, activity: [] };
  }
}

async function fetchNdaSummary(userId: string): Promise<NdaSummary> {
  try {
    const supabase = getServiceClient();

    const [{ count, error: activeCountError }, { data, error }] = await Promise.all([
      supabase
        .from('nda_agreements')
        .select('id', { count: 'exact', head: true })
        .eq('buyer_id', userId)
        .eq('status', 'signed'),
      supabase
        .from('nda_agreements')
        .select(
          `
            id,
            status,
            signed_at,
            updated_at,
            listing:listings (
              id,
              name
            )
          `,
        )
        .eq('buyer_id', userId)
        .order('updated_at', { ascending: false })
        .limit(RECENT_ACTIVITY_LIMIT),
    ]);

    if (activeCountError) throw activeCountError;
    if (error) throw error;

    const activity: BuyerDashboardActivityItem[] = (data ?? []).map((row) => ({
      id: `nda-${row.id}`,
      type: 'nda',
      title: row.listing?.name ?? 'NDA activity',
      subtitle: row.status === 'signed' ? 'NDA signed' : 'NDA update',
      timestamp: row.signed_at ?? row.updated_at ?? new Date().toISOString(),
      href: '/dashboard/ndas',
    }));

    return {
      activeCount: count ?? 0,
      activity,
    };
  } catch (error) {
    console.error('Failed to load NDA summary:', error);
    return { activeCount: 0, activity: [] };
  }
}

async function fetchOfferSummary(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<OfferSummary> {
  try {
    const [{ count, error: activeCountError }, { data, error }] = await Promise.all([
      supabase
        .from('offers')
        .select('id', { count: 'exact', head: true })
        .eq('buyer_id', userId)
        .in('status', ACTIVE_OFFER_STATUSES),
      supabase
        .from('offers')
        .select(
          `
            id,
            status,
            updated_at,
            created_at,
            listing:listings (
              id,
              name
            )
          `,
        )
        .eq('buyer_id', userId)
        .order('updated_at', { ascending: false })
        .limit(RECENT_ACTIVITY_LIMIT),
    ]);

    if (activeCountError) throw activeCountError;
    if (error) throw error;

    const activity: BuyerDashboardActivityItem[] = (data ?? []).map((row) => ({
      id: `offer-${row.id}`,
      type: 'offer',
      title: row.listing?.name ?? 'Offer update',
      subtitle: row.status === 'accepted' ? 'Offer accepted' : 'Offer submitted',
      timestamp: row.updated_at ?? row.created_at ?? new Date().toISOString(),
      href: '/dashboard/offers',
    }));

    return {
      activeCount: count ?? 0,
      activity,
    };
  } catch (error) {
    console.error('Failed to load offer summary:', error);
    return { activeCount: 0, activity: [] };
  }
}

async function fetchConversationSummary(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<ConversationSummary> {
  try {
    const [{ data: unreadCount, error: unreadError }, { data, error }] = await Promise.all([
      supabase.rpc('get_unread_count', { user_id: userId }),
      supabase.rpc('get_conversations_with_details', {
        p_user_id: userId,
        p_limit: RECENT_ACTIVITY_LIMIT,
        p_offset: 0,
      }),
    ]);

    if (unreadError) throw unreadError;
    if (error) throw error;

    const activity: BuyerDashboardActivityItem[] = (data ?? [])
      .map((conversation: any) => ({
        id: `conversation-${conversation.conversation_id}`,
        type: 'message',
        title: conversation.last_message_sender_full_name ?? 'New message',
        subtitle: conversation.last_message_content ?? 'New message received',
        timestamp:
          conversation.last_message_created_at ??
          conversation.conversation_updated_at ??
          conversation.conversation_created_at,
        href: `/dashboard/messages?conversation=${conversation.conversation_id}`,
      }))
      .filter((item) => Boolean(item.timestamp));

    return {
      unreadCount: typeof unreadCount === 'number' ? unreadCount : Number(unreadCount ?? 0),
      activity,
    };
  } catch (error) {
    console.error('Failed to load conversation summary:', error);
    return { unreadCount: 0, activity: [] };
  }
}

async function fetchVerificationStatus(
  supabase: SupabaseServerClient,
  user: { id: string; user_metadata?: Record<string, any> },
): Promise<DashboardVerificationStatus> {
  try {
    if (user.user_metadata?.buyer_verified === true) {
      return 'verified';
    }

    const metadataStatus = typeof user.user_metadata?.buyer_verification_status === 'string'
      ? (user.user_metadata?.buyer_verification_status as DashboardVerificationStatus)
      : null;

    const { data, error } = await supabase
      .from('verification_documents')
      .select('status')
      .eq('user_id', user.id)
      .in('doc_type', Array.from(BUYER_VERIFICATION_DOC_TYPES))
      .order('updated_at', { ascending: false })
      .limit(RECENT_ACTIVITY_LIMIT);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return metadataStatus ?? 'unverified';
    }

    if (data.some((row) => row.status === 'verified')) return 'verified';
    if (data.some((row) => row.status === 'pending')) return 'pending';
    if (data.some((row) => row.status === 'rejected')) return 'rejected';
    return metadataStatus ?? 'unverified';
  } catch (error) {
    console.error('Failed to determine verification status:', error);
    return 'unverified';
  }
}
