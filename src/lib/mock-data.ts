

import type { Client, Exercise, WorkoutPlan, ScheduledWorkout, DietPlan } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    age: 30,
    gender: 'Female',
    weight: 65,
    height: 165,
    fitnessLevel: 'Intermediate',
    goals: 'Improve strength and endurance. Tone muscles.',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman fitness',
    workoutHistory: '3 months of consistent gym, focusing on full body workouts. Last workout: Squats 3x10 @ 50kg, Bench Press 3x8 @ 30kg, Rows 3x10 @ 35kg.',
    progress: 60,
  },
  {
    id: '2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    age: 45,
    gender: 'Male',
    weight: 85,
    height: 175,
    fitnessLevel: 'Beginner',
    goals: 'Lose 10kg of weight. Build basic muscle mass.',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man smiling',
    workoutHistory: 'New to gym. Did some cardio and light machine work last week.',
    progress: 25,
  },
  {
    id: '3',
    name: 'Carol Danvers',
    email: 'carol@example.com',
    age: 28,
    gender: 'Female',
    weight: 70,
    height: 170,
    fitnessLevel: 'Advanced',
    goals: 'Prepare for a marathon. Increase cardiovascular fitness and leg strength.',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    workoutHistory: 'Consistent runner and weightlifter. Current PBs: Squat 100kg, Deadlift 120kg, 10k run in 45 mins.',
    progress: 85,
  },
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex1',
    name: 'Barbell Squat',
    description: 'A compound exercise that targets the quadriceps, hamstrings, glutes, and core. Stand with feet shoulder-width apart, bar on upper back. Lower hips as if sitting in a chair, keeping chest up and back straight. Descend until thighs are parallel to floor, then push through heels to return to start.',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    equipmentNeeded: ['Barbell', 'Squat Rack'],
    difficulty: 'Intermediate',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'barbell squat'
  },
  {
    id: 'ex2',
    name: 'Bench Press',
    description: 'A compound exercise targeting the chest, shoulders, and triceps. Lie on a bench with feet flat on the floor. Grip the barbell slightly wider than shoulder-width. Lower the bar to the chest, then press it back up until arms are fully extended.',
    muscleGroups: ['Pectorals', 'Deltoids', 'Triceps'],
    equipmentNeeded: ['Barbell', 'Bench'],
    difficulty: 'Intermediate',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'bench press'
  },
  {
    id: 'ex3',
    name: 'Levantamento Terra',
    description: 'A full-body compound exercise. Stand with mid-foot under the barbell. Bend at hips and knees to grip the bar. Keep back straight, chest up. Lift the bar by extending hips and knees simultaneously. Lower bar by reversing the motion.',
    muscleGroups: ['Hamstrings', 'Glutes', 'Back', 'Core', 'Traps'],
    equipmentNeeded: ['Barbell'],
    difficulty: 'Advanced',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'deadlift fitness'
  },
  {
    id: 'ex4',
    name: 'Overhead Press',
    description: 'Targets shoulders and triceps. Stand with barbell at shoulder height, hands slightly wider than shoulders. Press bar overhead until arms are fully extended. Lower bar back to shoulders under control.',
    muscleGroups: ['Deltoids', 'Triceps'],
    equipmentNeeded: ['Barbell'],
    difficulty: 'Intermediate',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'overhead press'
  },
  {
    id: 'ex5',
    name: 'Pull-up',
    description: 'Targets upper back and biceps. Hang from a pull-up bar with an overhand grip. Pull body up until chin is over the bar. Lower body slowly back to starting position.',
    muscleGroups: ['Latissimus Dorsi', 'Biceps', 'Rhomboids'],
    equipmentNeeded: ['Pull-up Bar'],
    difficulty: 'Intermediate',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'pull up'
  },
  {
    id: 'ex6',
    name: 'Plank',
    description: 'Core stability exercise. Hold a push-up position with forearms on the ground. Keep body in a straight line from head to heels. Engage core and glutes.',
    muscleGroups: ['Core', 'Abs'],
    difficulty: 'Beginner',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'plank exercise'
  },
   {
    id: 'ex7',
    name: 'Dumbbell Lunges',
    description: 'Targets quadriceps, glutes, and hamstrings. Hold dumbbells in each hand. Step forward with one leg, lowering hips until both knees are bent at a 90-degree angle. Push off front foot to return to start. Alternate legs.',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipmentNeeded: ['Dumbbells'],
    difficulty: 'Beginner',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'dumbbell lunges'
  },
  {
    id: 'ex8',
    name: 'Running (Treadmill)',
    description: 'Cardiovascular exercise. Adjust speed and incline as needed.',
    muscleGroups: ['Cardiovascular', 'Legs'],
    equipmentNeeded: ['Treadmill'],
    difficulty: 'Beginner',
    videoUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'treadmill running'
  }
];

export const MOCK_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'wp1',
    clientId: '1',
    name: 'Alice - Full Body Strength A',
    items: [
      { exerciseId: 'ex1', exerciseName: 'Barbell Squat', sets: 3, reps: '8-10' },
      { exerciseId: 'ex2', exerciseName: 'Bench Press', sets: 3, reps: '8-10' },
      { exerciseId: 'ex5', exerciseName: 'Pull-up', sets: 3, reps: 'As many as possible (AMRAP)' },
    ],
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_SCHEDULED_WORKOUTS: ScheduledWorkout[] = [
  {
    id: 'sw1',
    clientId: '1',
    workoutPlanId: 'wp1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Two days from now
    status: 'Scheduled',
  }
];

export const MOCK_DIET_PLANS: DietPlan[] = [
  {
    id: 'dp1',
    clientId: '1',
    name: 'Alice - Plano Inicial de Reeducação',
    description: 'Foco em alimentos integrais e hidratação.',
    createdAt: new Date().toISOString(),
    meals: [
      {
        mealName: 'Café da Manhã',
        time: '08:00',
        items: [
          { foodName: 'Ovos Cozidos', quantity: '2 unidades', notes: 'Fonte de proteína.' },
          { foodName: 'Mamão Papaia', quantity: '1/2 unidade pequena', notes: 'Com sementes.' },
          { foodName: 'Café Preto', quantity: '1 xícara', notes: 'Sem açúcar.' },
        ],
      },
      {
        mealName: 'Almoço',
        time: '12:30',
        items: [
          { foodName: 'Peito de Frango Grelhado', quantity: '120g' },
          { foodName: 'Arroz Integral', quantity: '4 colheres de sopa' },
          { foodName: 'Salada Colorida (folhas, tomate, pepino)', quantity: 'À vontade', notes: 'Temperar com azeite e limão.' },
        ],
      },
      {
        mealName: 'Jantar',
        time: '19:00',
        items: [
          { foodName: 'Salmão Assado', quantity: '100g' },
          { foodName: 'Batata Doce Cozida', quantity: '1 unidade média' },
          { foodName: 'Brócolis no Vapor', quantity: '1 xícara' },
        ],
      },
    ],
  },
];
