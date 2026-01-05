import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 타입 정의
export interface Candidate {
  name: string;
  description: string;
  imageUrl: string;
}

export interface Worldcup {
  id: string;
  topic: string;
  candidates: Candidate[];
  plays: number;
  created_at: string;
}

export interface Result {
  id: string;
  worldcup_id: string;
  winner_name: string;
  winner_image: string;
  created_at: string;
}
