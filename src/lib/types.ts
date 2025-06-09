
// Types.ts - Será populado conforme necessário para a nova interface simples.

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'personal' | 'client';
}

export interface Client {
  id: string; // Corresponde ao UID do Firebase Auth
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  avatarUrl?: string;
  goals?: string;
  medicalConditions?: string;
  // Adicionar outros campos relevantes para o cliente
}

export interface Exercise {
  id: string;
  name: string;
  series: string; // Ex: "3", "3-4"
  repetitions: string; // Ex: "10-12", "15"
  interval: string; // Ex: "60s", "1 min"
  observations?: string; // Campo opcional para notas adicionais
}

export interface WorkoutDay {
  id: string;
  name: string; // Ex: "Treino A", "Peito e Tríceps"
  exercises: Exercise[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  workoutDays: WorkoutDay[];
}

// Novo tipo para armazenar o progresso do cliente
export interface ClientProgramProgress {
  userId: string; // Email do cliente
  programId: string; // ID do programa atualmente atribuído
  completedWorkoutDayIds: string[]; // Array de IDs dos dias de treino finalizados
  checkedExercisesByDay: {
    [dayId: string]: string[]; // Mapeia dayId para um array de exerciseIds marcados
  };
  lastCompletionDate?: string; // Data da última finalização de um dia de treino (ISO string)
}
