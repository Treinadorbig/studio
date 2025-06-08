
'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AssignTrainingPage() {
  const params = useParams();
  const clientId = params.clientId as string;

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
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Aqui você poderá criar um novo programa de treino ou atribuir um existente da sua biblioteca para este cliente.
          </p>
          <div className="p-10 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center bg-muted/20">
            <Icons.WorkoutPlan className="h-16 w-16 text-primary/70 mb-4" />
            <p className="text-lg font-semibold text-foreground">Funcionalidade em Desenvolvimento</p>
            <p className="text-sm text-muted-foreground mt-1">
              Em breve: Seleção de programas da biblioteca, criação de treinos personalizados, definição de metas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
