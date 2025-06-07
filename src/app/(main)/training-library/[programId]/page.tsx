
'use client';

import type { TrainingProgram, WorkoutDay, Exercise } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutDayForm } from '@/components/training/workout-day-form';
import { WorkoutDayList } from '@/components/training/workout-day-list';
import { AddExerciseToWorkoutDayModal } from '@/components/training/add-exercise-to-workout-day-modal';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const LOCAL_STORAGE_PROGRAMS_KEY = 'trainingLibraryPrograms';
const LOCAL_STORAGE_EXERCISES_KEY = 'trainingLibraryExercises';

export default function TrainingProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;
  const { toast } = useToast();

  const [allPrograms, setAllPrograms] = useState<TrainingProgram[]>([]);
  const [currentProgram, setCurrentProgram] = useState<TrainingProgram | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedPrograms = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);
      if (storedPrograms) {
        const parsedPrograms = JSON.parse(storedPrograms);
        setAllPrograms(parsedPrograms);
        const foundProgram = parsedPrograms.find((p: TrainingProgram) => p.id === programId);
        if (foundProgram) {
          setCurrentProgram(foundProgram);
        } else {
          toast({ title: "Erro", description: "Programa não encontrado.", variant: "destructive" });
          router.push('/training-library');
        }
      }
      const storedExercises = localStorage.getItem(LOCAL_STORAGE_EXERCISES_KEY);
      if (storedExercises) {
        setAllExercises(JSON.parse(storedExercises));
      }
    }
  }, [programId, router, toast]);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && allPrograms.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_PROGRAMS_KEY, JSON.stringify(allPrograms));
    }
  }, [allPrograms, isClient]);
  
  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && allExercises.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_EXERCISES_KEY, JSON.stringify(allExercises));
    }
  }, [allExercises, isClient]);

  const updateProgramInList = (updatedProgram: TrainingProgram) => {
    const newAllPrograms = allPrograms.map(p => p.id === updatedProgram.id ? updatedProgram : p);
    setAllPrograms(newAllPrograms);
    setCurrentProgram(updatedProgram); // Ensure currentProgram state is also updated
  };

  const handleAddWorkoutDay = (dayName: string) => {
    if (!currentProgram) return;
    const newWorkoutDay: WorkoutDay = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      name: dayName,
      exercises: [],
    };
    const updatedProgram = {
      ...currentProgram,
      workoutDays: [...currentProgram.workoutDays, newWorkoutDay],
    };
    updateProgramInList(updatedProgram);
    toast({ title: 'Dia de Treino Adicionado!', description: `"${dayName}" adicionado ao programa.` });
  };

  const handleDeleteWorkoutDay = (dayId: string) => {
    if (!currentProgram) return;
    const dayToDelete = currentProgram.workoutDays.find(d => d.id === dayId);
    const updatedProgram = {
      ...currentProgram,
      workoutDays: currentProgram.workoutDays.filter(day => day.id !== dayId),
    };
    updateProgramInList(updatedProgram);
    if (dayToDelete) {
      toast({ title: 'Dia de Treino Removido!', description: `"${dayToDelete.name}" removido do programa.`, variant: 'destructive' });
    }
  };

  const handleOpenModalForDay = (dayId: string) => {
    setSelectedWorkoutDayId(dayId);
    setIsModalOpen(true);
  };

  const handleAddSelectedExercisesToDay = (selectedExercises: Exercise[]) => {
    if (!currentProgram || !selectedWorkoutDayId) return;

    const updatedProgram = {
      ...currentProgram,
      workoutDays: currentProgram.workoutDays.map(day => {
        if (day.id === selectedWorkoutDayId) {
          // Avoid adding duplicates by ID
          const existingExerciseIds = new Set(day.exercises.map(ex => ex.id));
          const newExercisesToAdd = selectedExercises.filter(ex => !existingExerciseIds.has(ex.id));
          return { ...day, exercises: [...day.exercises, ...newExercisesToAdd] };
        }
        return day;
      }),
    };
    updateProgramInList(updatedProgram);
    toast({ title: 'Exercícios Adicionados!', description: `${selectedExercises.length} exercício(s) adicionado(s) ao dia.` });
    setIsModalOpen(false);
    setSelectedWorkoutDayId(null);
  };

  const handleCreateNewExerciseAndAddToDay = (newExerciseData: Omit<Exercise, 'id'>) => {
    if (!currentProgram || !selectedWorkoutDayId) return;

    const newExercise: Exercise = {
      ...newExerciseData,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
    };

    // Add to global exercises
    setAllExercises(prev => [...prev, newExercise]);

    // Add to current workout day
    const updatedProgram = {
      ...currentProgram,
      workoutDays: currentProgram.workoutDays.map(day => {
        if (day.id === selectedWorkoutDayId) {
          return { ...day, exercises: [...day.exercises, newExercise] };
        }
        return day;
      }),
    };
    updateProgramInList(updatedProgram);
    toast({ title: 'Novo Exercício Criado e Adicionado!', description: `"${newExercise.name}" adicionado ao dia e à biblioteca.` });
    setIsModalOpen(false);
    setSelectedWorkoutDayId(null);
  };
  
  const handleRemoveExerciseFromDay = (dayId: string, exerciseId: string) => {
    if (!currentProgram) return;
    const exerciseToRemove = currentProgram.workoutDays
      .find(d => d.id === dayId)?.exercises.find(ex => ex.id === exerciseId);

    const updatedProgram = {
      ...currentProgram,
      workoutDays: currentProgram.workoutDays.map(day => {
        if (day.id === dayId) {
          return { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) };
        }
        return day;
      }),
    };
    updateProgramInList(updatedProgram);
    if(exerciseToRemove){
      toast({ title: 'Exercício Removido do Dia!', description: `"${exerciseToRemove.name}" removido deste dia de treino.`, variant: 'destructive' });
    }
  };


  if (!isClient || !currentProgram) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Icons.Activity className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando detalhes do programa...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/training-library">
              <Icons.WorkoutLibrary className="mr-2 h-4 w-4" />
              Voltar para Biblioteca
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Programa: {currentProgram.name}
          </h1>
          <p className="text-muted-foreground">
            Gerencie os dias de treino e os exercícios deste programa.
          </p>
        </div>
      </div>
      
      <Separator />

      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Adicionar Novo Dia de Treino</CardTitle>
          <CardDescription>Defina um novo dia de treino para este programa (Ex: Treino A, Peito e Tríceps).</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutDayForm onSave={handleAddWorkoutDay} />
        </CardContent>
      </Card>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Dias de Treino Salvos</h2>
        {currentProgram.workoutDays.length > 0 ? (
          <WorkoutDayList
            workoutDays={currentProgram.workoutDays}
            onDeleteDay={handleDeleteWorkoutDay}
            onAddExerciseToDay={handleOpenModalForDay}
            onRemoveExerciseFromDay={handleRemoveExerciseFromDay}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-md">
            <Icons.WorkoutPlan className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum dia de treino adicionado a este programa ainda.
            </p>
            <p className="text-sm text-muted-foreground mt-1">Use o formulário acima para adicionar o primeiro!</p>
          </div>
        )}
      </div>

      <AddExerciseToWorkoutDayModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedWorkoutDayId(null); }}
        allExercises={allExercises}
        onAddSelectedExercises={handleAddSelectedExercisesToDay}
        onCreateNewExercise={handleCreateNewExerciseAndAddToDay}
      />
    </div>
  );
}
