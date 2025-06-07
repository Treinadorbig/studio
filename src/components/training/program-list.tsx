
'use client';

import type { TrainingProgram } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
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

interface ProgramListProps {
  programs: TrainingProgram[];
  onDelete: (programId: string) => void;
}

export function ProgramList({ programs, onDelete }: ProgramListProps) {
  if (programs.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <Card key={program.id} className="shadow-sm rounded-md overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-4 bg-muted/20 flex flex-row items-center justify-between">
            <Link href={`/training-library/${program.id}`} className="hover:underline">
              <CardTitle className="text-lg font-semibold">{program.name}</CardTitle>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Icons.Delete className="h-4 w-4" />
                  <span className="sr-only">Remover programa {program.name}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover o programa "{program.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(program.id)} className="bg-destructive hover:bg-destructive/90">
                    Remover Programa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          {program.workoutDays.length > 0 && (
            <CardDescription className="px-4 pt-1 pb-2 text-xs text-muted-foreground">
              {program.workoutDays.length} dia(s) de treino: {program.workoutDays.map(d => d.name).join(', ')}
            </CardDescription>
          )}
        </Card>
      ))}
    </div>
  );
}
