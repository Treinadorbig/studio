
'use client';

import { useEffect, useState } from 'react';
import type { TrainingProgram, WorkoutDay, Exercise, User as ClientUserType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const LOCAL_STORAGE_PROGRAMS_KEY = 'trainingLibraryPrograms';
const CLIENT_TRAINING_ASSIGNMENTS_KEY = 'clientTrainingAssignments';
const CLIENT_AUTH_DATA_KEY = 'clientAuthData';

interface ClientTrainingAssignments {
  [clientId: string]: string; // clientId (raw email) -> programId
}

export default function DashboardPage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [assignedProgram, setAssignedProgram] = useState<TrainingProgram | null>(null);
  const [isLoadingProgram, setIsLoadingProgram] = useState(false);
  const [hasNoProgram, setHasNoProgram] = useState(false);

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
            if (currentClientUser && currentClientUser.name) {
              setClientName(currentClientUser.name);
            }
          } catch (e) {
            console.error("Error parsing client auth data:", e);
          }
        }
        
        setIsLoadingProgram(true);
        setHasNoProgram(false); 
        setAssignedProgram(null); 

        const assignmentsString = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
        const programsString = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);

        if (assignmentsString && programsString) {
          try {
            const assignments: ClientTrainingAssignments = JSON.parse(assignmentsString);
            const allPrograms: TrainingProgram[] = JSON.parse(programsString);
            
            const assignedProgramId = assignments[storedUserEmail]; 

            if (assignedProgramId) {
              const programDetails = allPrograms.find(p => p.id === assignedProgramId);
              if (programDetails) {
                setAssignedProgram(programDetails);
              } else {
                console.warn(`Assigned program with ID ${assignedProgramId} not found in library.`);
                setHasNoProgram(true); 
              }
            } else {
              setHasNoProgram(true);
            }
          } catch (e) {
            console.error("Error parsing training data:", e);
            setHasNoProgram(true);
          }
        } else {
          setHasNoProgram(true); 
        }
        setIsLoadingProgram(false);
      }
    }
  }, [isClientMounted]);

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

              {!isLoadingProgram && assignedProgram && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-primary flex items-center">
                    <Icons.WorkoutPlan className="mr-3 h-7 w-7" />
                    Seu Treino Atribuído: {assignedProgram.name}
                  </h2>
                  {assignedProgram.workoutDays.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {assignedProgram.workoutDays.map((day, index) => (
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
