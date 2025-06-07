
'use client';

import type { WorkoutDay, Exercise } from '@/lib/types';
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
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface WorkoutDayListProps {
  workoutDays: WorkoutDay[];
  onDeleteDay: (dayId: string) => void;
  onAddExerciseToDay: (dayId: string) => void;
  onRemoveExerciseFromDay: (dayId: string, exerciseId: string) => void;
}

export function WorkoutDayList({ workoutDays, onDeleteDay, onAddExerciseToDay, onRemoveExerciseFromDay }: WorkoutDayListProps) {
  if (workoutDays.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {workoutDays.map((day) => (
        <Card key={day.id} className="shadow-sm rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4 bg-muted/20">
            <CardTitle className="text-xl font-semibold">{day.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onAddExerciseToDay(day.id)}>
                <Icons.Add className="mr-2 h-4 w-4" />
                Adicionar Exercício
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Icons.Delete className="h-4 w-4" />
                    <span className="sr-only">Remover dia {day.name}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover o dia de treino "{day.name}" e todos os seus exercícios? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteDay(day.id)} className="bg-destructive hover:bg-destructive/90">
                      Remover Dia
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-4">
            {day.exercises.length > 0 ? (
              <ul className="space-y-3">
                {day.exercises.map((exercise) => (
                  <li key={exercise.id} className="p-3 border rounded-md shadow-xs bg-card flex justify-between items-start">
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.series} séries x {exercise.repetitions} reps - Intervalo: {exercise.interval}
                      </p>
                      {exercise.observations && <p className="text-xs text-muted-foreground mt-1">Obs: {exercise.observations}</p>}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10">
                          <Icons.Delete className="h-3.5 w-3.5" />
                           <span className="sr-only">Remover {exercise.name} de {day.name}</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Exercício do Dia</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover "{exercise.name}" do dia de treino "{day.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onRemoveExerciseFromDay(day.id, exercise.id)} className="bg-destructive hover:bg-destructive/90">
                            Remover Exercício
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum exercício adicionado a este dia. Clique em "Adicionar Exercício" acima.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
