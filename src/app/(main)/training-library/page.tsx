
'use client';

import type { Exercise, TrainingProgram } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseForm } from '@/components/training/exercise-form';
import { ExerciseList } from '@/components/training/exercise-list';
import { ProgramForm } from '@/components/training/program-form';
import { ProgramList } from '@/components/training/program-list';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const LOCAL_STORAGE_EXERCISES_KEY = 'trainingLibraryExercises';
const LOCAL_STORAGE_PROGRAMS_KEY = 'trainingLibraryPrograms';

export default function TrainingLibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedExercises = localStorage.getItem(LOCAL_STORAGE_EXERCISES_KEY);
      if (storedExercises) {
        setExercises(JSON.parse(storedExercises));
      }
      const storedPrograms = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);
      if (storedPrograms) {
        setTrainingPrograms(JSON.parse(storedPrograms));
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_EXERCISES_KEY, JSON.stringify(exercises));
    }
  }, [exercises, isClient]);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROGRAMS_KEY, JSON.stringify(trainingPrograms));
    }
  }, [trainingPrograms, isClient]);

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7), // More unique ID
    };
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    toast({
      title: 'Exercício Adicionado!',
      description: `${newExercise.name} foi salvo na biblioteca.`,
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exerciseToDelete = exercises.find(ex => ex.id === exerciseId);
    setExercises((prevExercises) => prevExercises.filter((ex) => ex.id !== exerciseId));
     // Also remove this exercise from any training program it might be part of
    setTrainingPrograms(prevPrograms => 
      prevPrograms.map(program => ({
        ...program,
        workoutDays: program.workoutDays.map(day => ({
          ...day,
          exercises: day.exercises.filter(ex => ex.id !== exerciseId)
        }))
      }))
    );
    if (exerciseToDelete) {
      toast({
        title: 'Exercício Removido!',
        description: `${exerciseToDelete.name} foi removido da biblioteca e de todos os programas.`,
        variant: 'destructive'
      });
    }
  };

  const handleAddProgram = (programName: string) => {
    const newProgram: TrainingProgram = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      name: programName,
      workoutDays: [],
    };
    setTrainingPrograms((prevPrograms) => [...prevPrograms, newProgram]);
    toast({
      title: 'Programa Adicionado!',
      description: `Programa "${programName}" criado com sucesso.`,
    });
  };

  const handleDeleteProgram = (programId: string) => {
    const programToDelete = trainingPrograms.find(p => p.id === programId);
    setTrainingPrograms((prevPrograms) => prevPrograms.filter((p) => p.id !== programId));
    if (programToDelete) {
      toast({
        title: 'Programa Removido!',
        description: `Programa "${programToDelete.name}" foi removido.`,
        variant: 'destructive',
      });
    }
  };
  
  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold flex items-center">
              <Icons.WorkoutLibrary className="mr-2 h-8 w-8 text-primary" />
              Carregando Biblioteca de Treinos...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aguarde um momento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Icons.WorkoutLibrary className="mr-3 h-8 w-8 text-primary" />
          Biblioteca de Treinos e Programas
        </h1>
        <p className="text-muted-foreground">
          Crie e gerencie seus programas de treino e exercícios base.
        </p>
      </div>

      {/* Seção de Programas de Treino */}
      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Programas de Treino</CardTitle>
          <CardDescription>Crie novos programas ou gerencie os existentes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProgramForm onSave={handleAddProgram} />
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-2">Programas Salvos</h3>
            {trainingPrograms.length > 0 ? (
              <ProgramList programs={trainingPrograms} onDelete={handleDeleteProgram} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 border-2 border-dashed rounded-md">
                <Icons.WorkoutPlan className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Nenhum programa de treino cadastrado. Crie um acima!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Seção de Exercícios */}
      <h2 className="text-2xl font-bold tracking-tight">Biblioteca de Exercícios Individuais</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ExerciseForm onSave={handleAddExercise} />
        </div>
        <div className="md:col-span-2">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>Exercícios Salvos na Biblioteca</CardTitle>
              <CardDescription>
                {exercises.length > 0
                  ? `Você tem ${exercises.length} exercício(s) salvo(s) na biblioteca global.`
                  : 'Nenhum exercício cadastrado ainda na biblioteca global.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exercises.length > 0 ? (
                <ExerciseList exercises={exercises} onDelete={handleDeleteExercise} />
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-md">
                  <Icons.WorkoutLibrary className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Sua biblioteca de exercícios está vazia. Adicione seu primeiro exercício no formulário ao lado!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
