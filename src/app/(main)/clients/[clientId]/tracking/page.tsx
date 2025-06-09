
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { TrainingProgram, WorkoutDay, Exercise } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';

const LOCAL_STORAGE_PROGRAMS_KEY = 'trainingLibraryPrograms';
const CLIENT_TRAINING_ASSIGNMENTS_KEY = 'clientTrainingAssignments';

interface ClientTrainingAssignment {
  programId: string;
  startDate?: string;
  endDate?: string;
}

interface ClientTrainingAssignments {
  [clientId: string]: ClientTrainingAssignment;
}

export default function ClientTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const clientIdFromParams = params.clientId as string; // Might be encoded

  const [assignedTrainingInfo, setAssignedTrainingInfo] = useState<{
    program: TrainingProgram;
    assignment: ClientTrainingAssignment;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [clientName, setClientName] = useState<string>(''); // Decoded client ID/email

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined' && clientIdFromParams) {
      const decodedClientId = decodeURIComponent(clientIdFromParams);
      setClientName(decodedClientId); 

      const assignmentsString = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
      const programsString = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);

      if (assignmentsString && programsString) {
        try {
          const assignments: ClientTrainingAssignments = JSON.parse(assignmentsString);
          const allPrograms: TrainingProgram[] = JSON.parse(programsString);
          
          const clientAssignment = assignments[decodedClientId];

          if (clientAssignment && clientAssignment.programId) {
            const programDetails = allPrograms.find(p => p.id === clientAssignment.programId);
            if (programDetails) {
              setAssignedTrainingInfo({ program: programDetails, assignment: clientAssignment });
            } else {
              setAssignedTrainingInfo(null); // Program not found in library
            }
          } else {
            setAssignedTrainingInfo(null); // No assignment for this client
          }
        } catch (error) {
          console.error("Error parsing tracking data:", error);
          setAssignedTrainingInfo(null);
        }
      } else {
        setAssignedTrainingInfo(null); // Missing assignments or programs data
      }
      setIsLoading(false);
    }
  }, [clientIdFromParams, isClientMounted]);

  const renderExerciseDetails = (exercise: Exercise) => (
    <div className="ml-4 pl-4 border-l border-muted-foreground/30 py-1 my-1 text-sm">
      <p><strong>Séries:</strong> {exercise.series}</p>
      <p><strong>Repetições:</strong> {exercise.repetitions}</p>
      <p><strong>Intervalo:</strong> {exercise.interval}</p>
      {exercise.observations && <p className="text-xs mt-1"><em>Obs: {exercise.observations}</em></p>}
    </div>
  );

  const getExerciseCountText = (count: number) => {
    if (count === 0) return "Nenhum exercício";
    if (count === 1) return "1 exercício";
    return `${count} exercícios`;
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    try {
      const date = new Date(dateString + 'T00:00:00'); // Ensure date is parsed as local
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy');
      }
      return 'Data inválida';
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/clients">
          <Icons.Users className="mr-2 h-4 w-4" />
          Voltar para Lista de Clientes
        </Link>
      </Button>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight flex items-center">
            <Icons.Activity className="mr-3 h-8 w-8 text-primary" />
            Acompanhamento do Cliente
          </CardTitle>
          <CardDescription>Cliente: {clientName || 'Carregando...'}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Icons.Activity className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-muted-foreground">Carregando informações do treino...</p>
            </div>
          )}

          {!isLoading && assignedTrainingInfo && (
            <div className="space-y-4">
               <div className="mb-4 p-4 border rounded-md bg-card">
                  <h2 className="text-2xl font-semibold text-primary flex items-center mb-2">
                    <Icons.WorkoutPlan className="mr-3 h-7 w-7" />
                    Treino Atribuído: {assignedTrainingInfo.program.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    <strong>Data de Início:</strong> {formatDateForDisplay(assignedTrainingInfo.assignment.startDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Data de Fim:</strong> {formatDateForDisplay(assignedTrainingInfo.assignment.endDate)}
                  </p>
               </div>

              {assignedTrainingInfo.program.workoutDays.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {assignedTrainingInfo.program.workoutDays.map((day, index) => (
                    <AccordionItem value={`day-${index}`} key={day.id}>
                      <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-sm">{day.name}</Badge> 
                            <span className="text-sm text-muted-foreground font-normal"> - {getExerciseCountText(day.exercises.length)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {day.exercises.length > 0 ? (
                          <ul className="space-y-3 pt-2">
                            {day.exercises.map((exercise) => (
                              <li key={exercise.id} className="p-3 border rounded-md shadow-xs bg-card">
                                <p className="font-medium text-base">{exercise.name}</p>
                                {renderExerciseDetails(exercise)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground py-2">Nenhum exercício neste dia.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">Este programa de treino ainda não tem dias de treino configurados.</p>
              )}
            </div>
          )}

          {!isLoading && !assignedTrainingInfo && (
             <Card className="mt-4 border-dashed border-primary/50 bg-primary/5">
                <CardContent className="pt-6 text-center">
                    <Icons.WorkoutPlan className="h-12 w-12 text-primary/70 mx-auto mb-3" />
                    <p className="font-semibold text-lg text-primary">Nenhum Treino Atribuído</p>
                    <p className="text-muted-foreground mt-1">
                      Este cliente ainda não tem um programa de treino atribuído.
                    </p>
                     <Button asChild className="mt-4">
                        <Link href={`/clients/${clientIdFromParams}/assign-training`}>
                            <Icons.Add className="mr-2 h-4 w-4" />
                            Atribuir Treino Agora
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    