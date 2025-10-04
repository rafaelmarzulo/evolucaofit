/**
 * TypeScript types for the application
 */

export interface User {
  id: number
  email: string
  full_name: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  height_cm?: number
  target_weight_kg?: number
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login?: string
}

export interface BodyMeasurement {
  id: number
  user_id: number
  measurement_date: string
  weight_kg: number
  body_fat_percentage?: number
  muscle_mass_kg?: number
  bmi?: number
  neck_cm?: number
  chest_cm?: number
  waist_cm?: number
  abdomen_cm?: number
  hips_cm?: number
  right_bicep_cm?: number
  left_bicep_cm?: number
  right_forearm_cm?: number
  left_forearm_cm?: number
  right_thigh_cm?: number
  left_thigh_cm?: number
  right_calf_cm?: number
  left_calf_cm?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Workout {
  id: number
  user_id: number
  workout_date: string
  workout_type: string
  duration_minutes?: number
  calories_burned?: number
  intensity?: 'low' | 'medium' | 'high'
  feeling?: 'great' | 'good' | 'ok' | 'tired' | 'exhausted'
  notes?: string
  exercises: Exercise[]
  created_at: string
  updated_at: string
}

export interface Exercise {
  id: number
  workout_id: number
  exercise_name: string
  exercise_type?: 'compound' | 'isolation' | 'cardio'
  sets?: number
  reps?: number
  weight_kg?: number
  rest_seconds?: number
  distance_km?: number
  duration_minutes?: number
  order_index: number
  notes?: string
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  full_name: string
  password: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  height_cm?: number
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}
