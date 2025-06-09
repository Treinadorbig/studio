
'use client';

import type { Exercise } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExerciseForm } from './exercise-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card'; // Changed import path and removed CardContent

interface AddExerciseToWorkoutDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  allExercises: Exercise[]; // Global library exercises
  onAddSelectedExercises: (selectedExercises: Exercise[]) => void;
  onCreateNewExercise: (newExerciseData: Omit<Exercise, 'id'>) => void;
}

export function AddExerciseToWorkoutDayModal({
  isOpen,
  onClose,
  allExercises,
  onAddSelectedExercises,
  onCreateNewExercise,
}: AddExerciseToWorkoutDayModalProps) {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleToggleExerciseSelection = (exerciseId: string) => {
    setSelectedExerciseIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleAddSelected = () => {
    if (selectedExerciseIds.size === 0) {
      toast({
        title: "Nenhum exercício selecionado",
        description: "Por favor, selecione ao menos um exercício da lista.",
        variant: "destructive",
      });
      return;
    }
    const exercisesToAdd = allExercises.filter(ex => selectedExerciseIds.has(ex.id));
    onAddSelectedExercises(exercisesToAdd);
    setSelectedExerciseIds(new Set()); // Reset selection
    onClose();
  };

  const handleCreateNew = (exerciseData: Omit<Exercise, 'id'>) => {
    onCreateNewExercise(exerciseData);
    // Form inside ExerciseForm handles its own reset, toast is handled by parent
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Exercício ao Dia de Treino</DialogTitle>
          <DialogDescription>
            Escolha um exercício existente da sua biblioteca ou crie um novo.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Selecionar Existente</TabsTrigger>
            <TabsTrigger value="create">Criar Novo Exercício</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="flex-grow overflow-auto mt-0 pt-4">
            <ScrollArea className="h-[calc(80vh-200px)] pr-3"> {/* Adjust height as needed */}
              {allExercises.length > 0 ? (
                <div className="space-y-3">
                  {allExercises.map((exercise) => (
                    <Card key={exercise.id} className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`ex-select-${exercise.id}`}
                          checked={selectedExerciseIds.has(exercise.id)}
                          onCheckedChange={() => handleToggleExerciseSelection(exercise.id)}
                        />
                        <Label htmlFor={`ex-select-${exercise.id}`} className="flex-1 cursor-pointer">
                          <span className="font-medium">{exercise.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {exercise.series}x{exercise.repetitions} - {exercise.interval}
                          </p>
                        </Label>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum exercício na sua biblioteca global. Crie um na aba "Criar Novo".
                </p>
              )}
            </ScrollArea>
            {allExercises.length > 0 && (
                <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background py-3">
                     <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleAddSelected} disabled={selectedExerciseIds.size === 0}>
                        Adicionar {selectedExerciseIds.size > 0 ? `(${selectedExerciseIds.size})` : ''} Selecionado(s)
                    </Button>
                </DialogFooter>
            )}
          </TabsContent>

          <TabsContent value="create" className="flex-grow overflow-auto mt-0 pt-4">
             <ScrollArea className="h-[calc(80vh-150px)] pr-3"> {/* Adjust height as needed */}
                <ExerciseForm onSave={handleCreateNew} />
             </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Footer for "Create New" tab is handled by ExerciseForm's own submit button */}
        {/* The "Select Existing" tab has its own footer for actions */}

      </DialogContent>
    </Dialog>
  );
}
