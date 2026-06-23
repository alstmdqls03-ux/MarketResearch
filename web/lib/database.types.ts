// GENERATED — 수기 편집 금지.
// `supabase gen types typescript` 산출물. 스키마 동결(Story 1.3) 후 실제 타입으로 교체된다.
// 부트스트랩 단계에선 빈 스키마 baseline (CI types-diff 게이트의 비교 기준).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
