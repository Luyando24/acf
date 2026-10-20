export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'contributor' | 'viewer';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type OpportunityType = 'Job' | 'Consultancy' | 'Tender' | 'Procurement' | 'Call for Proposals';
export type PeopleGroup = 'board' | 'management' | 'staff';
export type PartnerType = 'Partner' | 'Development Partner' | 'Collaborating Institution' | 'Network & Affiliation';
export type ApplicationStatus = 'new' | 'in_review' | 'approved' | 'declined';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: UserRole
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: UserRole
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          body: string
          seo_title: string | null
          seo_description: string | null
          status: ContentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          body: string
          seo_title?: string | null
          seo_description?: string | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          body?: string
          seo_title?: string | null
          seo_description?: string | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
      }
      people: {
        Row: {
          id: string
          group_type: PeopleGroup
          name: string
          position: string
          bio: string | null
          photo_url: string | null
          order_index: number
          email: string | null
          linkedin_url: string | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_type: PeopleGroup
          name: string
          position: string
          bio?: string | null
          photo_url?: string | null
          order_index?: number
          email?: string | null
          linkedin_url?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_type?: PeopleGroup
          name?: string
          position?: string
          bio?: string | null
          photo_url?: string | null
          order_index?: number
          email?: string | null
          linkedin_url?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      programmes: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          body: string
          cover_image: string | null
          icon: string | null
          order_index: number
          status: ContentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary: string
          body: string
          cover_image?: string | null
          icon?: string | null
          order_index?: number
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string
          body?: string
          cover_image?: string | null
          icon?: string | null
          order_index?: number
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
      }
      publication_categories: {
        Row: {
          id: string
          slug: string
          name: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          order_index?: number
          created_at?: string
        }
      }
      publications: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          category_id: string | null
          published_on: string
          cover_image: string | null
          file_path: string
          file_size: number | null
          mime: string | null
          is_featured: boolean
          download_count: number
          status: ContentStatus
          search_vector: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary: string
          category_id?: string | null
          published_on?: string
          cover_image?: string | null
          file_path: string
          file_size?: number | null
          mime?: string | null
          is_featured?: boolean
          download_count?: number
          status?: ContentStatus
          search_vector?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string
          category_id?: string | null
          published_on?: string
          cover_image?: string | null
          file_path?: string
          file_size?: number | null
          mime?: string | null
          is_featured?: boolean
          download_count?: number
          status?: ContentStatus
          search_vector?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          body: string
          featured_image: string | null
          category: string | null
          published_at: string
          status: ContentStatus
          author_id: string | null
          is_featured: boolean
          seo_title: string | null
          seo_description: string | null
          search_vector: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          body: string
          featured_image?: string | null
          category?: string | null
          published_at?: string
          status?: ContentStatus
          author_id?: string | null
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          search_vector?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          body?: string
          featured_image?: string | null
          category?: string | null
          published_at?: string
          status?: ContentStatus
          author_id?: string | null
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          search_vector?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          starts_at: string
          ends_at: string | null
          venue: string | null
          virtual_url: string | null
          registration_url: string | null
          featured_image: string | null
          status: ContentStatus
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          starts_at: string
          ends_at?: string | null
          venue?: string | null
          virtual_url?: string | null
          registration_url?: string | null
          featured_image?: string | null
          status?: ContentStatus
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          starts_at?: string
          ends_at?: string | null
          venue?: string | null
          virtual_url?: string | null
          registration_url?: string | null
          featured_image?: string | null
          status?: ContentStatus
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          slug: string
          title: string
          type: OpportunityType
          description: string
          opens_on: string
          closes_on: string
          application_instructions: string | null
          apply_url: string | null
          contact_info: string | null
          attachment_url: string | null
          status: ContentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          type: OpportunityType
          description: string
          opens_on?: string
          closes_on: string
          application_instructions?: string | null
          apply_url?: string | null
          contact_info?: string | null
          attachment_url?: string | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          type?: OpportunityType
          description?: string
          opens_on?: string
          closes_on?: string
          application_instructions?: string | null
          apply_url?: string | null
          contact_info?: string | null
          attachment_url?: string | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          name: string
          type: PartnerType
          logo_url: string | null
          website_url: string | null
          description: string | null
          order_index: number
          show_on_home: boolean
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: PartnerType
          logo_url?: string | null
          website_url?: string | null
          description?: string | null
          order_index?: number
          show_on_home?: boolean
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: PartnerType
          logo_url?: string | null
          website_url?: string | null
          description?: string | null
          order_index?: number
          show_on_home?: boolean
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      membership_categories: {
        Row: {
          id: string
          name: string
          description: string
          benefits: Json
          requirements: Json
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          benefits?: Json
          requirements?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          benefits?: Json
          requirements?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      membership_applications: {
        Row: {
          id: string
          applicant_type: 'organisation' | 'individual'
          org_name: string | null
          contact_name: string
          email: string
          phone: string
          category_id: string | null
          location_province: string | null
          sector_interest: string | null
          details: Json
          consent_given: boolean
          consent_at: string
          status: ApplicationStatus
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          applicant_type?: 'organisation' | 'individual'
          org_name?: string | null
          contact_name: string
          email: string
          phone: string
          category_id?: string | null
          location_province?: string | null
          sector_interest?: string | null
          details?: Json
          consent_given: boolean
          consent_at?: string
          status?: ApplicationStatus
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          applicant_type?: 'organisation' | 'individual'
          org_name?: string | null
          contact_name?: string
          email?: string
          phone?: string
          category_id?: string | null
          location_province?: string | null
          sector_interest?: string | null
          details?: Json
          consent_given?: boolean
          consent_at?: string
          status?: ApplicationStatus
          notes?: string | null
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          consent_given: boolean
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          consent_given: boolean
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          consent_given?: boolean
          is_read?: boolean
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          status: 'subscribed' | 'unsubscribed' | 'pending'
          source: string
          consent_at: string
          confirmed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          status?: 'subscribed' | 'unsubscribed' | 'pending'
          source?: string
          consent_at?: string
          confirmed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          status?: 'subscribed' | 'unsubscribed' | 'pending'
          source?: string
          consent_at?: string
          confirmed_at?: string | null
          created_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

type WithRelationships<T> = {
  [K in keyof T]: T[K] extends { Row: infer R; Insert: infer I; Update: infer U }
    ? { Row: R; Insert: I; Update: U; Relationships: [] }
    : T[K]
}

/** Schema shape expected by supabase-js. Source tables stay above; this adds empty relationships. */
export interface SupabaseDatabase {
  public: {
    Tables: WithRelationships<Database['public']['Tables']>
    Views: Database['public']['Views']
    Functions: Database['public']['Functions']
  }
}
