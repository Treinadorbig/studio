
export interface Client {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number; // in kg
  height: number; // in cm
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string; // text area for goals
  avatarUrl?: string;
  dataAiHint?: string;
  workoutHistory?: string; // Simple text for now, could be structured
  progress?: number; // Percentage 0-100
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string; // URL to a demonstration video
  dataAiHint?: string;
  muscleGroups: string[];
  equipmentNeeded?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface WorkoutItem {
  exerciseId: string;
  exerciseName: string; // Denormalized for easy display
  sets: number;
  reps: string; // Can be a range like "8-12" or a number
  rest?: string; // e.g., "60s"
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  items: WorkoutItem[];
  createdAt: string; // ISO Date string
}

export interface ScheduledWorkout {
  id: string;
  clientId: string;
  workoutPlanId: string;
  date: string; // ISO Date string
  status: 'Scheduled' | 'Completed' | 'Missed';
  trainerNotes?: string;
  clientFeedback?: string;
}

export interface AISuggestion {
  exerciseName: string;
  sets: number;
  reps: number | string;
  weight: string;
  reason: string;
}
