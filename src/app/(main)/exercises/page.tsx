
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MOCK_EXERCISES } from '@/lib/mock-data';
import type { Exercise } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddExerciseForm } from '@/components/exercises/add-exercise-form';
import { useToast } from '@/hooks/use-toast';

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-200 cursor-pointer animate-fade-in">
          <CardHeader>
            {exercise.videoUrl && (
               <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image src={exercise.videoUrl} alt={exercise.name} layout="fill" objectFit="cover" data-ai-hint={exercise.dataAiHint || 'exercise video'} />
              </div>
            )}
            <CardTitle className="mt-2 text-xl font-headline">{exercise.name}</CardTitle>
            <CardDescription className="text-sm h-12 overflow-hidden text-ellipsis">
              {exercise.description.substring(0, 80)}...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Muscles: {Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.slice(0,2).join(', ') : exercise.muscleGroups}{exercise.muscleGroups.length > 2 && Array.isArray(exercise.muscleGroups) ? '...' : ''}
              </p>
              {exercise.equipmentNeeded && (
                <p className="text-xs text-muted-foreground">
                  Equipment: {Array.isArray(exercise.equipmentNeeded) ? exercise.equipmentNeeded.join(', ') : exercise.equipmentNeeded}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
             <Badge variant={exercise.difficulty === 'Beginner' ? 'secondary' : exercise.difficulty === 'Intermediate' ? 'outline' : 'default'}>
              {exercise.difficulty || 'N/A'}
            </Badge>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{exercise.name}</DialogTitle>
          <DialogDescription>{exercise.difficulty && <Badge variant="outline" className="mr-2">{exercise.difficulty}</Badge>} Targets: {Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.join(', ') : exercise.muscleGroups}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {exercise.videoUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image src={exercise.videoUrl} alt={exercise.name} layout="fill" objectFit="cover" data-ai-hint={exercise.dataAiHint || 'exercise video'} />
            </div>
          )}
          <p className="text-sm text-foreground whitespace-pre-line">{exercise.description}</p>
          {exercise.equipmentNeeded && (Array.isArray(exercise.equipmentNeeded) ? exercise.equipmentNeeded.length > 0 : exercise.equipmentNeeded) && (
            <p className="text-sm text-muted-foreground"><strong>Equipment:</strong> {Array.isArray(exercise.equipmentNeeded) ? exercise.equipmentNeeded.join(', ') : exercise.equipmentNeeded}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (!Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddExercise = (newExerciseData: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      id: String(Date.now()), // Simple unique ID
      ...newExerciseData,
      videoUrl: newExerciseData.videoUrl || 'https://placehold.co/300x200.png', // Default placeholder
      dataAiHint: newExerciseData.dataAiHint || 'exercise generic',
    };
    setExercises(prevExercises => [newExercise, ...prevExercises]);
    setIsAddExerciseDialogOpen(false);
    toast({
      title: "Exercício Adicionado!",
      description: `${newExercise.name} foi adicionado à biblioteca.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-headline tracking-tight">Biblioteca de Treinos</h1>
        <div className="flex gap-2 items-center">
          <div className="relative w-full md:w-auto">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar exercícios ou grupos..."
              className="pl-10 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddExerciseDialogOpen} onOpenChange={setIsAddExerciseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icons.Add className="mr-2 h-5 w-5" />
                Adicionar Exercício
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Exercício</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do novo exercício para adicioná-lo à biblioteca.
                </DialogDescription>
              </DialogHeader>
              <AddExerciseForm onSubmit={handleAddExercise} onCancel={() => setIsAddExerciseDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredExercises.length === 0 ? (
         <Card className="flex flex-col items-center justify-center p-10 text-center">
           <Icons.Exercises className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">Nenhum Exercício Encontrado</CardTitle>
          <CardDescription className="mt-2">
            Ajuste seu termo de busca ou adicione novos exercícios à biblioteca.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
