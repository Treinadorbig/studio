
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { TrainingProgram } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const LOCAL_STORAGE_PROGRAMS_KEY = 'trainingLibraryPrograms';
const CLIENT_TRAINING_ASSIGNMENTS_KEY = 'clientTrainingAssignments';

interface ClientTrainingAssignments {
  [clientId: string]: string; // clientId -> programId
}

export default function AssignTrainingPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const { toast } = useToast();

  const [availablePrograms, setAvailablePrograms] = useState<TrainingProgram[]>([]);
  const [assignedProgramId, setAssignedProgramId] = useState<string | null>(null);
  const [assignedProgramDetails, setAssignedProgramDetails] = useState<TrainingProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined') {
      // Load available programs
      const storedPrograms = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);
      if (storedPrograms) {
        setAvailablePrograms(JSON.parse(storedPrograms));
      }

      // Load client assignments
      const storedAssignments = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
      if (storedAssignments) {
        const assignments: ClientTrainingAssignments = JSON.parse(storedAssignments);
        const currentClientAssignment = assignments[clientId];
        if (currentClientAssignment) {
          setAssignedProgramId(currentClientAssignment);
        }
      }
      setIsLoading(false);
    }
  }, [clientId, isClientMounted]);

  useEffect(() => {
    if (assignedProgramId && availablePrograms.length > 0) {
      const program = availablePrograms.find(p => p.id === assignedProgramId);
      setAssignedProgramDetails(program || null);
    } else {
      setAssignedProgramDetails(null);
    }
  }, [assignedProgramId, availablePrograms]);

  const handleAssignProgram = (programIdToAssign: string) => {
    if (typeof window !== 'undefined') {
      const storedAssignments = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
      let assignments: ClientTrainingAssignments = storedAssignments ? JSON.parse(storedAssignments) : {};
      assignments[clientId] = programIdToAssign;
      localStorage.setItem(CLIENT_TRAINING_ASSIGNMENTS_KEY, JSON.stringify(assignments));
      setAssignedProgramId(programIdToAssign);
      const program = availablePrograms.find(p => p.id === programIdToAssign);
      toast({
        title: 'Programa Atribuído!',
        description: `O programa "${program?.name || 'Selecionado'}" foi atribuído a ${decodeURIComponent(clientId)}.`,
      });
    }
  };

  const handleRemoveProgram = () => {
    if (typeof window !== 'undefined' && assignedProgramDetails) {
      const storedAssignments = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
      if (storedAssignments) {
        let assignments: ClientTrainingAssignments = JSON.parse(storedAssignments);
        delete assignments[clientId];
        localStorage.setItem(CLIENT_TRAINING_ASSIGNMENTS_KEY, JSON.stringify(assignments));
        setAssignedProgramId(null);
        setAssignedProgramDetails(null);
        toast({
          title: 'Programa Removido!',
          description: `O programa anteriormente atribuído a ${decodeURIComponent(clientId)} foi removido.`,
          variant: 'destructive',
        });
      }
    }
  };

  if (!isClientMounted || isLoading) {
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
              <Icons.WorkoutLibrary className="mr-3 h-8 w-8 text-primary" />
              Montar Treino para Cliente
            </CardTitle>
            <CardDescription>Cliente: {clientId ? decodeURIComponent(clientId) : 'Carregando...'}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Icons.Activity className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando informações...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Icons.WorkoutLibrary className="mr-3 h-8 w-8 text-primary" />
            Atribuir Programa de Treino
          </CardTitle>
          <CardDescription>Cliente: {decodeURIComponent(clientId)}</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedProgramDetails ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Programa Atualmente Atribuído:</h3>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icons.WorkoutPlan className="mr-2 h-5 w-5 text-primary" />
                    {assignedProgramDetails.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Este programa está ativo para {decodeURIComponent(clientId)}.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleRemoveProgram} variant="destructive">
                    <Icons.Delete className="mr-2 h-4 w-4" />
                    Remover Programa Atribuído
                  </Button>
                </CardFooter>
              </Card>
              <Separator className="my-6" />
               <p className="text-muted-foreground text-center">Para atribuir um novo programa, primeiro remova o atual.</p>
            </div>
          ) : (
            availablePrograms.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-3">Selecione um Programa da Biblioteca:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePrograms.map(program => (
                    <Card key={program.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                           <Icons.WorkoutPlan className="mr-2 h-5 w-5 text-muted-foreground" />
                          {program.name}
                        </CardTitle>
                         <CardDescription>{program.workoutDays.length} dia(s) de treino</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button onClick={() => handleAssignProgram(program.id)} className="w-full">
                          <Icons.Add className="mr-2 h-4 w-4" />
                          Atribuir a {decodeURIComponent(clientId)}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center bg-muted/20">
                <Icons.WorkoutLibrary className="h-16 w-16 text-primary/70 mb-4" />
                <p className="text-lg font-semibold text-foreground">Nenhum Programa na Biblioteca</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Você ainda não criou nenhum programa de treino.
                </p>
                <Button asChild>
                  <Link href="/training-library">
                    <Icons.Add className="mr-2 h-4 w-4" />
                    Criar Programa Agora
                  </Link>
                </Button>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
