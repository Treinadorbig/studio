
'use client';

import { useEffect, useState } from 'react';
import type { TrainingProgram, WorkoutDay, Exercise, User as ClientUserType, ClientProgramProgress } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format, isValid, parseISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_PROGRAMS_KEY = 'trainingLibraryPrograms';
const CLIENT_TRAINING_ASSIGNMENTS_KEY = 'clientTrainingAssignments';
const CLIENT_AUTH_DATA_KEY = 'clientAuthData';
const CLIENT_PROGRAM_PROGRESS_KEY = 'clientProgramProgress';

interface ClientTrainingAssignment {
  programId: string;
  startDate?: string;
  endDate?: string;
}

interface ClientTrainingAssignments {
  [clientId: string]: ClientTrainingAssignment;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [userType, setUserType] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);

  const [assignedTrainingInfo, setAssignedTrainingInfo] = useState<{
    program: TrainingProgram;
    assignment: ClientTrainingAssignment;
  } | null>(null);

  const [isLoadingProgram, setIsLoadingProgram] = useState(false);
  const [hasNoProgram, setHasNoProgram] = useState(false);

  const [clientProgress, setClientProgress] = useState<ClientProgramProgress | null>(null);
  const [currentDayCheckedExercises, setCurrentDayCheckedExercises] = useState<Set<string>>(new Set());
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(undefined);


  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType');
      const storedUserEmail = localStorage.getItem('userEmail');
      setUserType(storedUserType);
      setUserEmail(storedUserEmail);

      if (storedUserType === 'client' && storedUserEmail) {
        const clientAuthDataString = localStorage.getItem(CLIENT_AUTH_DATA_KEY);
        if (clientAuthDataString) {
          try {
            const allClientUsers: ClientUserType[] = JSON.parse(clientAuthDataString);
            const currentClientUser = allClientUsers.find(c => c.email === storedUserEmail);
            if (currentClientUser?.name) {
              setClientName(currentClientUser.name);
            }
          } catch (e) { console.error("Error parsing client auth data:", e); }
        }

        setIsLoadingProgram(true);
        setHasNoProgram(false);
        setAssignedTrainingInfo(null);

        const assignmentsString = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
        const programsString = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);

        if (assignmentsString && programsString) {
          try {
            const assignments: ClientTrainingAssignments = JSON.parse(assignmentsString);
            const allPrograms: TrainingProgram[] = JSON.parse(programsString);
            const clientAssignment = assignments[storedUserEmail];

            if (clientAssignment?.programId) {
              const programDetails = allPrograms.find(p => p.id === clientAssignment.programId);
              if (programDetails) {
                setAssignedTrainingInfo({ program: programDetails, assignment: clientAssignment });

                const progressString = localStorage.getItem(CLIENT_PROGRAM_PROGRESS_KEY);
                let allProgress: ClientProgramProgress[] = progressString ? JSON.parse(progressString) : [];
                const userProgress = allProgress.find(p => p.userId === storedUserEmail && p.programId === programDetails.id);
                
                if (userProgress) {
                  setClientProgress(userProgress);
                } else {
                  const newProgress: ClientProgramProgress = {
                    userId: storedUserEmail,
                    programId: programDetails.id,
                    completedWorkoutDayIds: [],
                    checkedExercisesByDay: {},
                    lastCompletionDate: undefined,
                  };
                  setClientProgress(newProgress);
                  // Do not save here, save only on action (e.g. finishing a day)
                }

              } else {
                setHasNoProgram(true);
              }
            } else {
              setHasNoProgram(true);
            }
          } catch (e) { console.error("Error parsing training data:", e); setHasNoProgram(true); }
        } else {
          setHasNoProgram(true);
        }
        setIsLoadingProgram(false);
      }
    }
  }, [isClientMounted, userEmail]);
  
  useEffect(() => {
    if (activeAccordionItem && clientProgress && assignedTrainingInfo) {
      const dayIndexStr = activeAccordionItem.replace('day-', '');
      const dayIndex = parseInt(dayIndexStr, 10);

      if (!isNaN(dayIndex) && dayIndex >= 0 && dayIndex < assignedTrainingInfo.program.workoutDays.length) {
          const workoutDay = assignedTrainingInfo.program.workoutDays[dayIndex];
          if (workoutDay) {
              const checkedForThisDay = clientProgress.checkedExercisesByDay[workoutDay.id] || [];
              setCurrentDayCheckedExercises(new Set(checkedForThisDay));
          } else {
               setCurrentDayCheckedExercises(new Set());
          }
      } else {
          setCurrentDayCheckedExercises(new Set()); 
      }
    } else {
       setCurrentDayCheckedExercises(new Set()); 
    }
  }, [activeAccordionItem, clientProgress, assignedTrainingInfo]);


  const handleCheckExercise = (exerciseId: string, dayId: string) => {
    setCurrentDayCheckedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      // Save in-progress ticks to clientProgress state but not to localStorage yet
      if (clientProgress && userEmail && assignedTrainingInfo) {
        setClientProgress(prevProgress => {
            if (!prevProgress) return null;
            return {
                ...prevProgress,
                checkedExercisesByDay: {
                    ...prevProgress.checkedExercisesByDay,
                    [dayId]: Array.from(newSet),
                }
            };
        });
      }
      return newSet;
    });
  };

  const handleFinishDay = (dayId: string) => {
    if (!clientProgress || !userEmail || !assignedTrainingInfo) return;

    const isNewProgressCompletion = !clientProgress.completedWorkoutDayIds.includes(dayId);
    let newCompletedWorkoutDayIds = [...clientProgress.completedWorkoutDayIds];
    if (isNewProgressCompletion) {
      newCompletedWorkoutDayIds.push(dayId);
    }

    const updatedProgress: ClientProgramProgress = {
      ...clientProgress,
      completedWorkoutDayIds: newCompletedWorkoutDayIds,
      checkedExercisesByDay: {
        ...clientProgress.checkedExercisesByDay,
        [dayId]: [], // Reset checkboxes for this day for the next session
      },
      lastCompletionDate: new Date().toISOString(),
    };
    setClientProgress(updatedProgress);

    // Save to localStorage
    const progressString = localStorage.getItem(CLIENT_PROGRAM_PROGRESS_KEY);
    let allProgress: ClientProgramProgress[] = progressString ? JSON.parse(progressString) : [];
    const userProgressIndex = allProgress.findIndex(p => p.userId === userEmail && p.programId === assignedTrainingInfo.program.id);

    if (userProgressIndex > -1) {
      allProgress[userProgressIndex] = updatedProgress;
    } else {
      allProgress.push(updatedProgress);
    }
    localStorage.setItem(CLIENT_PROGRAM_PROGRESS_KEY, JSON.stringify(allProgress));

    toast({ title: "Treino do Dia Finalizado!", description: "Seu progresso foi salvo. O dia está pronto para ser refeito!" });
    
    // Clear UI checkboxes immediately for the current view
    setCurrentDayCheckedExercises(new Set());
  };


  let welcomeMessage = 'Bem-vindo(a)!';
  if (userType === 'personal') {
    welcomeMessage = `Olá, Treinador Big! Bom trabalho!`;
  } else if (userType === 'client') {
    if (clientName) {
      const firstName = clientName.split(' ')[0];
      welcomeMessage = `Olá ${firstName}, bom treino pra você!`;
    } else if (userEmail) {
      welcomeMessage = `Bem-vindo(a), Cliente (${userEmail})!`;
    } else {
      welcomeMessage = `Bem-vindo(a), Cliente!`;
    }
  }

  const renderExerciseDetails = (exercise: Exercise, dayId: string) => (
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
      const date = parseISO(dateString); 
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy');
      }
      const dateParts = dateString.split('-');
      if (dateParts.length === 3) {
        const parsedLegacyDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        if (isValid(parsedLegacyDate)) {
          return format(parsedLegacyDate, 'dd/MM/yyyy');
        }
      }
      return 'Data inválida';
    } catch (error) {
      return 'Data inválida';
    }
  };

  const calculateProgress = () => {
    if (!clientProgress) return 0;
    const targetTotalTreinos = 22; // Hardcoded target
    const completedUniqueDays = clientProgress.completedWorkoutDayIds.length;
    const progress = (completedUniqueDays / targetTotalTreinos) * 100;
    return Math.min(progress, 100); 
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{welcomeMessage}</CardTitle>
          <CardDescription>
            {userType === 'personal' ? 'Acesse as funcionalidades abaixo para gerenciar sua academia.' : 'Este é o seu painel de controle.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userType === 'personal' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/clients" passHref>
                <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer rounded-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Icons.Users className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="text-xl">Gerenciar Clientes</CardTitle>
                      <CardDescription>Visualize e gerencie seus clientes.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full mt-2">Acessar Clientes</Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/training-library" passHref>
                <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer rounded-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Icons.WorkoutLibrary className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="text-xl">Biblioteca de Treinos</CardTitle>
                      <CardDescription>Crie e organize programas e exercícios.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full mt-2">Acessar Biblioteca</Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}

          {userType === 'client' && (
            <>
              {isLoadingProgram && (
                <div className="flex flex-col items-center justify-center py-10">
                  <Icons.Activity className="h-10 w-10 text-primary animate-spin mb-3" />
                  <p className="text-muted-foreground">Carregando seu treino...</p>
                </div>
              )}

              {!isLoadingProgram && assignedTrainingInfo && clientProgress && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Progresso do Objetivo Atual</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Progress value={progressPercentage} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        Você completou {clientProgress.completedWorkoutDayIds.length} de {22} treinos para o objetivo.
                      </p>
                      {clientProgress.lastCompletionDate && (
                        <p className="text-xs text-muted-foreground">
                          Último treino finalizado em: {formatDateForDisplay(clientProgress.lastCompletionDate)}.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="mb-4 p-4 border rounded-md bg-card">
                    <h2 className="text-2xl font-semibold text-primary flex items-center mb-2">
                      <Icons.WorkoutPlan className="mr-3 h-7 w-7" />
                      Seu Treino: {assignedTrainingInfo.program.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      <strong>Data de Início:</strong> {formatDateForDisplay(assignedTrainingInfo.assignment.startDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Data de Fim:</strong> {formatDateForDisplay(assignedTrainingInfo.assignment.endDate)}
                    </p>
                  </div>

                  {assignedTrainingInfo.program.workoutDays.length > 0 ? (
                     <Accordion 
                        type="single" 
                        collapsible 
                        className="w-full" 
                        value={activeAccordionItem}
                        onValueChange={setActiveAccordionItem}
                    >
                      {assignedTrainingInfo.program.workoutDays.map((day, index) => {
                        // This variable indicates if the day has ever contributed to the overall progress
                        // const isDayMarkedAsCompletedForProgress = clientProgress.completedWorkoutDayIds.includes(day.id);
                        return (
                          <AccordionItem value={`day-${index}`} key={day.id}>
                            <AccordionTrigger className="text-lg hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-sm">{day.name}</Badge> 
                                <span className="text-sm text-muted-foreground font-normal"> - {getExerciseCountText(day.exercises.length)}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {day.exercises.length > 0 ? (
                                <ul className="space-y-4 pt-2">
                                  {day.exercises.map((exercise) => (
                                    <li key={exercise.id} className="p-3 border rounded-md shadow-xs bg-card">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <Checkbox
                                          id={`ex-${day.id}-${exercise.id}`}
                                          checked={currentDayCheckedExercises.has(exercise.id)}
                                          onCheckedChange={() => handleCheckExercise(exercise.id, day.id)}
                                        />
                                        <Label htmlFor={`ex-${day.id}-${exercise.id}`} className="font-medium text-base flex-1 cursor-pointer">
                                          {exercise.name}
                                        </Label>
                                      </div>
                                      {renderExerciseDetails(exercise, day.id)}
                                    </li>
                                  ))}
                                  <Button onClick={() => handleFinishDay(day.id)} className="w-full mt-4">
                                    <Icons.Check className="mr-2 h-4 w-4" />
                                    Finalizar Treino do Dia
                                  </Button>
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground py-2">Nenhum exercício neste dia.</p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground">Este programa de treino ainda não tem dias de treino configurados.</p>
                  )}
                </div>
              )}

              {!isLoadingProgram && hasNoProgram && (
                <Card className="mt-4 border-dashed border-primary/50 bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <Icons.WorkoutPlan className="h-12 w-12 text-primary/70 mx-auto mb-3" />
                    <p className="font-semibold text-lg text-primary">Nenhum Treino Atribuído</p>
                    <p className="text-muted-foreground mt-1">
                      Você ainda não tem um programa de treino. Fale com seu personal trainer para que ele possa montar um para você!
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
