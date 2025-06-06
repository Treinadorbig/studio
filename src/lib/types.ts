

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
  exerciseId?: string; // Tornou-se opcional
  exerciseName: string; // Nome do exercício, seja da biblioteca ou customizado
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

// Diet Plan Types
export interface FoodItem {
  foodName: string;
  quantity: string; // e.g., "100g", "1 unidade", "1 xícara"
  notes?: string; // Optional notes for the food item
}

export interface DietMeal {
  mealName: string; // e.g., "Café da Manhã", "Almoço", "Lanche da Tarde"
  items: FoodItem[];
  time?: string; // Optional: e.g., "08:00", "13:00"
}

export interface DietPlan {
  id: string;
  clientId: string;
  name: string; // e.g., "Plano de Ganho de Massa - Semana 1"
  description?: string;
  meals: DietMeal[];
  createdAt: string; // ISO Date string
}

