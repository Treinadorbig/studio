
'use client';

import type { Exercise } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseForm } from '@/components/training/exercise-form';
import { ExerciseList } from '@/components/training/exercise-list';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'trainingLibraryExercises';

export default function TrainingLibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedExercises = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedExercises) {
        setExercises(JSON.parse(storedExercises));
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exercises));
    }
  }, [exercises, isClient]);

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(), // Simple ID generation
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
    if (exerciseToDelete) {
      toast({
        title: 'Exercício Removido!',
        description: `${exerciseToDelete.name} foi removido da biblioteca.`,
        variant: 'destructive'
      });
    }
  };
  
  // Placeholder para edição futura
  // const handleEditExercise = (updatedExercise: Exercise) => {
  //   setExercises(prev => prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex));
  //   toast({ title: 'Exercício Atualizado!' });
  // };


  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold flex items-center">
              <Icons.WorkoutLibrary className="mr-2 h-8 w-8 text-primary" />
              Carregando Biblioteca de Exercícios...
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
          Biblioteca de Exercícios
        </h1>
        <p className="text-muted-foreground">
          Crie e gerencie sua lista de exercícios base.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ExerciseForm onSave={handleAddExercise} />
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>Exercícios Salvos</CardTitle>
              <CardDescription>
                {exercises.length > 0
                  ? `Você tem ${exercises.length} exercício(s) salvo(s).`
                  : 'Nenhum exercício cadastrado ainda.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exercises.length > 0 ? (
                <ExerciseList exercises={exercises} onDelete={handleDeleteExercise} />
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-md">
                  <Icons.WorkoutLibrary className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Sua biblioteca está vazia. Adicione seu primeiro exercício no formulário ao lado!
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
