// Floqly Database Types
// После выполнения миграции можно перегенерировать через:
// npx supabase gen types typescript --project-id rhdvlmhcfdqbqjgmcgcc > src/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type WidgetType = 'cookie' | 'simple' | 'ai_chat'
export type WidgetStatus = 'draft' | 'active' | 'paused' | 'archived'
export type ConversationStatus = 'active' | 'closed' | 'handed_off'
export type MessageRole = 'user' | 'assistant' | 'system'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          phone: string | null
          timezone: string
          language: string
          plan: PlanType
          plan_expires_at: string | null
          widgets_limit: number
          projects_limit: number
          messages_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          timezone?: string
          language?: string
          plan?: PlanType
          plan_expires_at?: string | null
          widgets_limit?: number
          projects_limit?: number
          messages_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          timezone?: string
          language?: string
          plan?: PlanType
          plan_expires_at?: string | null
          widgets_limit?: number
          projects_limit?: number
          messages_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          domain: string | null
          description: string | null
          settings: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          domain?: string | null
          description?: string | null
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string | null
          description?: string | null
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      widgets: {
        Row: {
          id: string
          project_id: string
          user_id: string
          name: string
          type: WidgetType
          status: WidgetStatus
          config: Json
          styles: Json
          embed_key: string
          views_count: number
          interactions_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name: string
          type: WidgetType
          status?: WidgetStatus
          config?: Json
          styles?: Json
          embed_key?: string
          views_count?: number
          interactions_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          name?: string
          type?: WidgetType
          status?: WidgetStatus
          config?: Json
          styles?: Json
          embed_key?: string
          views_count?: number
          interactions_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          widget_id: string
          visitor_id: string
          visitor_name: string | null
          visitor_email: string | null
          visitor_phone: string | null
          visitor_metadata: Json
          status: ConversationStatus
          is_lead: boolean
          messages_count: number
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          widget_id: string
          visitor_id: string
          visitor_name?: string | null
          visitor_email?: string | null
          visitor_phone?: string | null
          visitor_metadata?: Json
          status?: ConversationStatus
          is_lead?: boolean
          messages_count?: number
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          widget_id?: string
          visitor_id?: string
          visitor_name?: string | null
          visitor_email?: string | null
          visitor_phone?: string | null
          visitor_metadata?: Json
          status?: ConversationStatus
          is_lead?: boolean
          messages_count?: number
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: MessageRole
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: MessageRole
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: MessageRole
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          project_id: string
          widget_id: string | null
          conversation_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          company: string | null
          message: string | null
          source: string | null
          status: LeadStatus
          metadata: Json
          external_id: string | null
          synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          widget_id?: string | null
          conversation_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          message?: string | null
          source?: string | null
          status?: LeadStatus
          metadata?: Json
          external_id?: string | null
          synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          widget_id?: string | null
          conversation_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          message?: string | null
          source?: string | null
          status?: LeadStatus
          metadata?: Json
          external_id?: string | null
          synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          widget_id: string | null
          project_id: string | null
          event_type: string
          event_data: Json
          visitor_id: string | null
          session_id: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          country: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          widget_id?: string | null
          project_id?: string | null
          event_type: string
          event_data?: Json
          visitor_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          widget_id?: string | null
          project_id?: string | null
          event_type?: string
          event_data?: Json
          visitor_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_widget_views: {
        Args: { widget_uuid: string }
        Returns: void
      }
      increment_widget_interactions: {
        Args: { widget_uuid: string }
        Returns: void
      }
    }
    Enums: {
      widget_type: WidgetType
      widget_status: WidgetStatus
      conversation_status: ConversationStatus
      message_role: MessageRole
      lead_status: LeadStatus
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Convenience exports
export type Profile = Tables<'profiles'>
export type Project = Tables<'projects'>
export type Widget = Tables<'widgets'>
export type Conversation = Tables<'conversations'>
export type Message = Tables<'messages'>
export type Lead = Tables<'leads'>
export type AnalyticsEvent = Tables<'analytics_events'>

// Widget config types
export interface CookieWidgetConfig {
  position: 'bottom' | 'top' | 'floating'
  text: string
  policy_url: string
  accept_text: string
  reject_text: string
  theme: 'light' | 'dark' | 'auto'
  backdrop_blur: boolean
  hide_days: number
}

export interface SimpleWidgetConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  channels: {
    type: 'whatsapp' | 'telegram' | 'vk' | 'email' | 'phone' | 'callback'
    url?: string
    phone?: string
    enabled: boolean
  }[]
  cta_message: string
  show_cta: boolean
  color: string
}

export interface AiChatWidgetConfig {
  position: 'bottom-right' | 'bottom-left'
  greeting: string
  placeholder: string
  offline_message: string
  collect_email: boolean
  collect_phone: boolean
  avatar_url?: string
  operator_name: string
}
