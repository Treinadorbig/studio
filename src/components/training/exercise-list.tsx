
'use client';

import type { Exercise } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ExerciseListProps {
  exercises: Exercise[];
  onDelete: (exerciseId: string) => void;
  // onEdit: (exercise: Exercise) => void; // Para edição futura
}

export function ExerciseList({ exercises, onDelete }: ExerciseListProps) {
  if (exercises.length === 0) {
    return null; // A mensagem de lista vazia é mostrada na página pai
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="shadow-sm rounded-md overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-4 bg-muted/30">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{exercise.name}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Icons.Delete className="h-4 w-4" />
                    <span className="sr-only">Remover {exercise.name}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover o exercício "{exercise.name}"? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(exercise.id)} className="bg-destructive hover:bg-destructive/90">
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-3 text-sm space-y-2">
            <div className="grid grid-cols-3 gap-x-2 gap-y-1">
              <div>
                <p className="font-medium text-muted-foreground">Séries</p>
                <p>{exercise.series}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Reps</p>
                <p>{exercise.repetitions}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Intervalo</p>
                <p>{exercise.interval}</p>
              </div>
            </div>
            {exercise.observations && (
              <div>
                <p className="font-medium text-muted-foreground">Observações</p>
                <p className="text-xs whitespace-pre-wrap">{exercise.observations}</p>
              </div>
            )}
          </CardContent>
          {/* 
          <CardFooter className="px-4 py-2 border-t">
             <Button variant="outline" size="sm" onClick={() => onEdit(exercise)}>
              <Icons.Edit className="mr-2 h-3 w-3" /> Editar
            </Button> 
          </CardFooter>
          */}
        </Card>
      ))}
    </div>
  );
}
