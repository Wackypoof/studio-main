export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          city: string | null;
          created_at: string;
          description: string | null;
          employees: number | null;
          id: string;
          industry: string;
          meta: Json | null;
          name: string;
          owner_id: string;
          published_at: string | null;
          region: string | null;
          slug: string | null;
          status: Database["public"]["Enums"]["listing_status"];
          subindustry: string | null;
          tags: string[] | null;
          updated_at: string;
          years_established: number | null;
          country: string | null;
          customers: number | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string;
          description?: string | null;
          employees?: number | null;
          id?: string;
          industry: string;
          meta?: Json | null;
          name: string;
          owner_id: string;
          published_at?: string | null;
          region?: string | null;
          slug?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          subindustry?: string | null;
          tags?: string[] | null;
          updated_at?: string;
          years_established?: number | null;
          country?: string | null;
          customers?: number | null;
        };
        Update: {
          city?: string | null;
          created_at?: string;
          description?: string | null;
          employees?: number | null;
          id?: string;
          industry?: string;
          meta?: Json | null;
          name?: string;
          owner_id?: string;
          published_at?: string | null;
          region?: string | null;
          slug?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          subindustry?: string | null;
          tags?: string[] | null;
          updated_at?: string;
          years_established?: number | null;
          country?: string | null;
          customers?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      listing_documents: {
        Row: {
          created_at: string;
          doc_type: Database["public"]["Enums"]["document_type"];
          file_name: string | null;
          file_size: number | null;
          id: string;
          listing_id: string;
          status: Database["public"]["Enums"]["document_status"];
          storage_path: string;
          updated_at: string;
          uploaded_by: string;
          verified_at: string | null;
          verified_by: string | null;
        };
        Insert: {
          created_at?: string;
          doc_type: Database["public"]["Enums"]["document_type"];
          file_name?: string | null;
          file_size?: number | null;
          id?: string;
          listing_id: string;
          status?: Database["public"]["Enums"]["document_status"];
          storage_path: string;
          updated_at?: string;
          uploaded_by: string;
          verified_at?: string | null;
          verified_by?: string | null;
        };
        Update: {
          created_at?: string;
          doc_type?: Database["public"]["Enums"]["document_type"];
          file_name?: string | null;
          file_size?: number | null;
          id?: string;
          listing_id?: string;
          status?: Database["public"]["Enums"]["document_status"];
          storage_path?: string;
          updated_at?: string;
          uploaded_by?: string;
          verified_at?: string | null;
          verified_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "listing_documents_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listing_documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listing_documents_verified_by_fkey";
            columns: ["verified_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      listing_financials: {
        Row: {
          asking_price: number | null;
          assets: number | null;
          created_at: string | null;
          currency: string;
          fiscal_year: number;
          growth_rate: number | null;
          id: string;
          liabilities: number | null;
          listing_id: string;
          notes: string | null;
          profit: number | null;
          revenue: number | null;
          updated_at: string | null;
          valuation_multiple: number | null;
        };
        Insert: {
          asking_price?: number | null;
          assets?: number | null;
          created_at?: string | null;
          currency?: string;
          fiscal_year: number;
          growth_rate?: number | null;
          id?: string;
          liabilities?: number | null;
          listing_id: string;
          notes?: string | null;
          profit?: number | null;
          revenue?: number | null;
          updated_at?: string | null;
          valuation_multiple?: number | null;
        };
        Update: {
          asking_price?: number | null;
          assets?: number | null;
          created_at?: string | null;
          currency?: string;
          fiscal_year?: number;
          growth_rate?: number | null;
          id?: string;
          liabilities?: number | null;
          listing_id?: string;
          notes?: string | null;
          profit?: number | null;
          revenue?: number | null;
          updated_at?: string | null;
          valuation_multiple?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "listing_financials_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
      listing_photos: {
        Row: {
          alt: string | null;
          created_at: string;
          id: string;
          is_primary: boolean;
          listing_id: string;
          position: number;
          storage_path: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          alt?: string | null;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          listing_id: string;
          position?: number;
          storage_path: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          alt?: string | null;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          listing_id?: string;
          position?: number;
          storage_path?: string;
          updated_at?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "listing_photos_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "listings";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      listing_latest_financials: {
        Row: {
          asking_price: number | null;
          assets: number | null;
          currency: string | null;
          fiscal_year: number | null;
          growth_rate: number | null;
          listing_id: string | null;
          profit: number | null;
          revenue: number | null;
          valuation_multiple: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      ensure_profile_exists: {
        Args: {
          user_id: string;
        };
        Returns: void;
      };
      listing_is_publishable: {
        Args: {
          p_listing_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      document_status: "pending" | "verified" | "rejected";
      document_type:
        | "financial_statement"
        | "legal_doc"
        | "tax_return"
        | "photo"
        | "other";
      listing_status: "draft" | "active" | "sold" | "withdrawn";
      user_role: "admin" | "user" | "guest";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
