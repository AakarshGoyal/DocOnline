// Hand-written types describing the tables in supabase/schema.sql, so
// TypeScript can check our queries. If you add columns later, update
// this file (or generate it properly with the Supabase CLI:
// `npx supabase gen types typescript`).

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "patient" | "doctor";
          full_name: string;
          phone: string | null;
          age: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role: "patient" | "doctor";
          full_name: string;
          phone?: string | null;
          age?: number | null;
        };
        Update: Partial<{
          full_name: string;
          phone: string | null;
          age: number | null;
        }>;
        Relationships: [];
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          description: string;
          symptoms: string;
          icon: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      doctors: {
        Row: {
          profile_id: string;
          specialty_id: string;
          degree: string;
          experience: number;
          hospital: string;
          price: number;
        };
        Insert: {
          profile_id: string;
          specialty_id: string;
          degree: string;
          experience: number;
          hospital: string;
          price: number;
        };
        Update: Partial<{
          specialty_id: string;
          degree: string;
          experience: number;
          hospital: string;
          price: number;
        }>;
        Relationships: [];
      };
      doctor_slots: {
        Row: {
          id: string;
          doctor_id: string;
          slot_date: string;
          slot_time: string;
          status: "available" | "booked";
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          slot_id: string;
          remarks: string;
          price: number;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_today_slots: {
        Args: { p_start: string; p_end: string };
        Returns: void;
      };
      book_slot: {
        Args: { p_slot_id: string; p_remarks: string };
        Returns: string;
      };
      cancel_appointment: {
        Args: { p_appointment_id: string };
        Returns: void;
      };
      reschedule_appointment: {
        Args: { p_appointment_id: string; p_new_slot_id: string };
        Returns: void;
      };
    };
  };
};
