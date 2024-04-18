export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
            foreignKeyName: "public_landlord_private_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
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
          },
        ]
      }
      properties: {
        Row: {
          baths: number | null
          beds: number | null
          country: string
          county: string
          description: string | null
          house: string
          id: string
          postcode: string
          property_type: string | null
          street: string
        }
        Insert: {
          baths?: number | null
          beds?: number | null
          country: string
          county: string
          description?: string | null
          house: string
          id?: string
          postcode: string
          property_type?: string | null
          street: string
        }
        Update: {
          baths?: number | null
          beds?: number | null
          country?: string
          county?: string
          description?: string | null
          house?: string
          id?: string
          postcode?: string
          property_type?: string | null
          street?: string
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
            foreignKeyName: "property_ownership_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_public_profiles_full"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "property_ownership_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "full_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_ownership_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      report_reasons: {
        Row: {
          owner_only: boolean
          reason: string
        }
        Insert: {
          owner_only?: boolean
          reason: string
        }
        Update: {
          owner_only?: boolean
          reason?: string
        }
        Relationships: []
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
          },
        ]
      }
      review_reports: {
        Row: {
          contact_email: string | null
          created_at: string
          explanation: string
          id: number
          reason: string
          reporter_id: string
          review_id: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          explanation: string
          id?: number
          reason: string
          reporter_id: string
          review_id: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          explanation?: string
          id?: number
          reason?: string
          reporter_id?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_review_reports_reason_fkey"
            columns: ["reason"]
            isOneToOne: false
            referencedRelation: "report_reasons"
            referencedColumns: ["reason"]
          },
          {
            foreignKeyName: "public_review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
        ]
      }
      review_tags: {
        Row: {
          review_id: string
          tag: string
        }
        Insert: {
          review_id: string
          tag: string
        }
        Update: {
          review_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_tags_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
          {
            foreignKeyName: "review_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag"]
          },
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
            referencedRelation: "full_properties"
            referencedColumns: ["id"]
          },
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
          },
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
          review_posted: string
          reviewer_id: string
        }
        Insert: {
          landlord_rating: number
          property_id: string
          property_rating: number
          review_body: string
          review_date: string
          review_id?: string
          review_posted?: string
          reviewer_id: string
        }
        Update: {
          landlord_rating?: number
          property_id?: string
          property_rating?: number
          review_body?: string
          review_date?: string
          review_id?: string
          review_posted?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "full_properties"
            referencedColumns: ["id"]
          },
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
          },
        ]
      }
      tags: {
        Row: {
          tag: string
        }
        Insert: {
          tag: string
        }
        Update: {
          tag?: string
        }
        Relationships: []
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
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      full_properties: {
        Row: {
          address: string | null
          average_rating: number | null
          baths: number | null
          beds: number | null
          country: string | null
          county: string | null
          description: string | null
          house: string | null
          id: string | null
          last_reviewed: string | null
          ownership_history: Json | null
          postcode: string | null
          property_type: string | null
          reviews: Json | null
          street: string | null
          tag_counts: Json | null
          tags: string[] | null
        }
        Relationships: []
      }
      landlord_profile_pictures: {
        Row: {
          profile_picture: string | null
          user_id: string | null
        }
        Insert: {
          profile_picture?: string | null
          user_id?: never
        }
        Update: {
          profile_picture?: string | null
          user_id?: never
        }
        Relationships: []
      }
      landlord_public_profiles_full: {
        Row: {
          average_rating: number | null
          bio: string | null
          display_email: string | null
          display_name: string | null
          profile_image_id: string | null
          profile_picture: string | null
          type: string | null
          user_id: string | null
          verified: boolean | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_public_profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "landlord_private_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      average_landlord_rating: {
        Args: {
          id: string
        }
        Returns: number
      }
      get_average_property_rating: {
        Args: {
          property_id: string
        }
        Returns: number
      }
      get_properties_with_addresses: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          baths: number
          beds: number
          country: string
          county: string
          description: string
          house: string
          postcode: string
          property_type: string
          street: string
          address: string
        }[]
      }
      get_properties_with_ratings: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          baths: number
          beds: number
          country: string
          county: string
          description: string
          house: string
          postcode: string
          property_type: string
          street: string
          average_rating: number
        }[]
      }
      landlord_public_profiles_with_ratings: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          website: string
          bio: string
          profile_image_id: string
          verified: boolean
          type: string
          display_email: string
          display_name: string
          average_rating: number
        }[]
      }
      most_recent_review_date_for_property: {
        Args: {
          id: string
        }
        Returns: string
      }
      plain_text_address: {
        Args: {
          property_id: string
        }
        Returns: string
      }
      properties_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          baths: number
          beds: number
          country: string
          county: string
          description: string
          house: string
          postcode: string
          property_type: string
          street: string
          address: string
          average_rating: number
          last_reviewed: string
        }[]
      }
      property_owner_on_date: {
        Args: {
          property_id: string
          query_date: string
        }
        Returns: string
      }
      reviews_for_landlord: {
        Args: {
          id: string
        }
        Returns: {
          property_id: string
          reviewer_id: string
          review_date: string
          review_id: string
          landlord_rating: number
          property_rating: number
          review_body: string
          review_posted: string
          landlord_id: string
        }[]
      }
      reviews_with_landlords: {
        Args: Record<PropertyKey, never>
        Returns: {
          property_id: string
          reviewer_id: string
          review_date: string
          review_id: string
          landlord_rating: number
          property_rating: number
          review_body: string
          review_posted: string
          landlord_id: string
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
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
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
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

