export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      landlord_private_profiles: {
        Row: {
          city: string | null
          country: string
          county: string | null
          first_name: string | null
          house: string
          last_name: string | null
          phone_number: string
          postcode: string
          street: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          country: string
          county?: string | null
          first_name?: string | null
          house: string
          last_name?: string | null
          phone_number: string
          postcode: string
          street?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string
          county?: string | null
          first_name?: string | null
          house?: string
          last_name?: string | null
          phone_number?: string
          postcode?: string
          street?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "landlord_private_profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      landlord_public_profiles: {
        Row: {
          bio: string | null
          display_email: string
          display_name: string
          profile_image_id: string | null
          type: string
          user_id: string
          verified: boolean
          website: string | null
        }
        Insert: {
          bio?: string | null
          display_email: string
          display_name: string
          profile_image_id?: string | null
          type: string
          user_id: string
          verified: boolean
          website?: string | null
        }
        Update: {
          bio?: string | null
          display_email?: string
          display_name?: string
          profile_image_id?: string | null
          type?: string
          user_id?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_public_profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "landlord_private_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      properties: {
        Row: {
          address: string
          baths: number | null
          beds: number | null
          country: string
          county: string
          description: string | null
          house: string
          id: string
          postcode: string
          property_type: string
          street: string | null
        }
        Insert: {
          address: string
          baths?: number | null
          beds?: number | null
          country: string
          county: string
          description?: string | null
          house: string
          id?: string
          postcode: string
          property_type: string
          street?: string | null
        }
        Update: {
          address?: string
          baths?: number | null
          beds?: number | null
          country?: string
          county?: string
          description?: string | null
          house?: string
          id?: string
          postcode?: string
          property_type?: string
          street?: string | null
        }
        Relationships: []
      }
      property_ownership: {
        Row: {
          ended_at: string | null
          landlord_id: string
          property_id: string
          started_at: string
        }
        Insert: {
          ended_at?: string | null
          landlord_id: string
          property_id: string
          started_at: string
        }
        Update: {
          ended_at?: string | null
          landlord_id?: string
          property_id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_ownership_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_public_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "property_ownership_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      review_photos: {
        Row: {
          photo_id: number
          review_id: string
        }
        Insert: {
          photo_id: number
          review_id: string
        }
        Update: {
          photo_id?: number
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          }
        ]
      }
      reviewer_private_profiles: {
        Row: {
          property_id: string
          reviewer_id: string
          user_id: string
        }
        Insert: {
          property_id: string
          reviewer_id?: string
          user_id: string
        }
        Update: {
          property_id?: string
          reviewer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_private_profiles_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_private_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      reviews: {
        Row: {
          landlord_rating: number
          property_id: string
          property_rating: number
          review_body: string
          review_date: string
          review_id: string
          reviewer_id: string
        }
        Insert: {
          landlord_rating: number
          property_id: string
          property_rating: number
          review_body: string
          review_date: string
          review_id?: string
          reviewer_id: string
        }
        Update: {
          landlord_rating?: number
          property_id?: string
          property_rating?: number
          review_body?: string
          review_date?: string
          review_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "reviewer_private_profiles"
            referencedColumns: ["reviewer_id"]
          }
        ]
      }
      uploaded_files: {
        Row: {
          file_name: string | null
          id: number
        }
        Insert: {
          file_name?: string | null
          id?: number
        }
        Update: {
          file_name?: string | null
          id?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_public_profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_average_property_rating: {
        Args: {
          property_id: string
        }
        Returns: number
      }
      get_properties_with_ratings: {
        Args: Record<PropertyKey, never>
        Returns: {
          property_id: string
          address: string
          average_rating: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

