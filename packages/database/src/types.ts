/**
 * Supabase Database Types
 *
 * IMPORTANT: This is a placeholder file!
 * Real types should be generated with: pnpm db:generate
 * Command: supabase gen types typescript --local > src/types.ts
 *
 * This placeholder prevents TypeScript errors when Supabase is not yet configured.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database schema placeholder
export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: never[]
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
        Relationships: never[]
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string
    }
    CompositeTypes: {
      [key: string]: Record<string, unknown>
    }
  }
}

// Convenience type exports
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Enum placeholders (will be replaced by real Supabase enums)
export type WidgetType = 'cookie' | 'simple' | 'ai_chat'
export type WidgetStatus = 'draft' | 'active' | 'inactive'
export type ConversationStatus = 'active' | 'resolved' | 'archived'
export type MessageRole = 'user' | 'assistant' | 'system'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise'

// Table type placeholders (will be replaced by real Supabase tables)
export type Profile = {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  user_id: string
  name: string
  domain: string
  created_at: string
  updated_at: string
}

export type Widget = {
  id: string
  project_id: string
  type: WidgetType
  status: WidgetStatus
  config: Json
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  widget_id: string
  visitor_id: string
  status: ConversationStatus
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  created_at: string
}

export type Lead = {
  id: string
  conversation_id: string
  email: string | null
  phone: string | null
  name: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
}

export type AnalyticsEvent = {
  id: string
  widget_id: string
  event_type: string
  event_data: Json
  created_at: string
}

// Config type placeholders
export type CookieWidgetConfig = {
  title?: string
  description?: string
  acceptButtonText?: string
  declineButtonText?: string
  position?: 'bottom' | 'top'
  theme?: 'light' | 'dark'
}

export type SimpleWidgetConfig = {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  primaryColor?: string
  socialLinks?: {
    telegram?: string
    whatsapp?: string
    vk?: string
    instagram?: string
  }
  contactForm?: {
    enabled: boolean
    email?: string
  }
}

export type AiChatWidgetConfig = {
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
  welcomeMessage?: string
  triggerBehavior?: {
    exitIntent?: boolean
    scrollPercentage?: number
    timeDelay?: number
  }
  aiSettings?: {
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }
}
