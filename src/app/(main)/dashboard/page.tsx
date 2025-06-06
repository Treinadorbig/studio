
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { MOCK_CLIENTS, MOCK_WORKOUT_PLANS, MOCK_DIET_PLANS } from '@/lib/mock-data';
import type { Client, WorkoutPlan, DietPlan, DietMeal } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddClientForm } from '@/components/dashboard/add-client-form';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Trainer's View Components
function TrainerClientCard({ client }: { client: Client }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={client.avatarUrl} alt={client.name} data-ai-hint={client.dataAiHint || 'user avatar'} />
          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-headline">{client.name}</CardTitle>
          <CardDescription>{client.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">Metas: {client.goals.substring(0,50)}...</p>
        <p className="text-sm text-muted-foreground">Nível: {client.fitnessLevel}</p>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={`/clients/${client.id}`}>
              Ver Perfil <Icons.ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TrainerDashboardContent({ clients, onAddClient }: { clients: Client[], onAddClient: (data: Omit<Client, 'id' | 'avatarUrl' | 'dataAiHint' | 'age' | 'gender' | 'weight' | 'height' | 'fitnessLevel' | 'goals' | 'workoutHistory' | 'progress'>) => void }) {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline tracking-tight">Dashboard de Clientes</h1>
        <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icons.Add className="mr-2 h-5 w-5" />
              Adicionar Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Insira o nome e e-mail do novo cliente. A senha padrão para o primeiro acesso será &quot;changeme&quot;.
              </DialogDescription>
            </DialogHeader>
            <AddClientForm onSubmit={(data) => { onAddClient(data); setIsAddClientDialogOpen(false);}} onCancel={() => setIsAddClientDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-10 text-center">
           <Icons.Clients className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">Nenhum Cliente Ainda</CardTitle>
          <CardDescription className="mt-2">
            Comece adicionando seu primeiro cliente.
          </CardDescription>
           <Button onClick={() => setIsAddClientDialogOpen(true)} className="mt-6">
            <Icons.Add className="mr-2 h-5 w-5" />
            Adicionar Novo Cliente
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <TrainerClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}

// Client's View Components
function ClientWorkoutPlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Card className="bg-card hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{plan.name}</CardTitle>
        {plan.description && <CardDescription>{plan.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2 text-sm">Exercícios:</h4>
        <ul className="space-y-2">
          {plan.items.map((item, index) => (
            <li key={index} className="text-sm border-b border-border pb-1 last:border-b-0">
              <strong>{item.exerciseName}</strong>: {item.sets} séries de {item.reps} reps.
              {item.rest && ` Descanso: ${item.rest}`}
              {item.notes && <p className="text-xs text-muted-foreground pl-2"><em>Notas: {item.notes}</em></p>}
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="mt-4">
          <Icons.WorkoutPlan className="mr-2 h-4 w-4" /> Ver Detalhes do Treino
        </Button>
      </CardContent>
    </Card>
  );
}

function ClientDietPlanCard({ plan }: { plan: DietPlan }) {
  return (
    <Card className="bg-card hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{plan.name}</CardTitle>
        {plan.description && <CardDescription>{plan.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2 text-sm">Refeições Principais:</h4>
        {plan.meals.length > 0 ? (
          <ul className="space-y-1">
            {plan.meals.slice(0, 3).map((meal, index) => ( // Show first 3 meals as a summary
              <li key={index} className="text-sm">
                <Badge variant="secondary" className="mr-2">{meal.time || 'N/A'}</Badge> {meal.mealName}
              </li>
            ))}
            {plan.meals.length > 3 && <li className="text-sm text-muted-foreground">...e mais.</li>}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma refeição detalhada neste plano.</p>
        )}
        <Button variant="outline" size="sm" className="mt-4">
          <Icons.Diet className="mr-2 h-4 w-4" /> Ver Detalhes da Dieta
        </Button>
      </CardContent>
    </Card>
  );
}

function ClientDashboardContent({ client, clientWorkoutPlans, clientDietPlans }: { 
  client: Client | null, 
  clientWorkoutPlans: WorkoutPlan[],
  clientDietPlans: DietPlan[],
}) {
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <Icons.Profile className="h-20 w-20 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Cliente não encontrado</h2>
        <p className="text-muted-foreground">Não foi possível carregar os dados do cliente. Por favor, tente fazer login novamente.</p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight font-headline">Bem-vindo(a), {client.name}!</h1>
        <p className="text-lg text-muted-foreground">Seu painel personalizado no Protocolo Big.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Icons.Profile className="mr-2 h-6 w-6 text-primary" /> Meu Perfil (Resumo)</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Badge variant="outline">Idade</Badge> <p className="inline ml-2">{client.age} anos</p></div>
          <div><Badge variant="outline">Nível</Badge> <p className="inline ml-2">{client.fitnessLevel}</p></div>
          <div className="md:col-span-2"><Badge variant="outline">Metas</Badge> <p className="inline ml-2 whitespace-pre-line">{client.goals}</p></div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Icons.Activity className="mr-2 h-6 w-6 text-primary" /> Meu Progresso</CardTitle>
          <CardDescription>Sua jornada em direção às suas metas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={client.progress || 0} className="w-full h-4" />
            <span className="text-lg font-semibold text-primary">{client.progress || 0}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {client.progress && client.progress < 30 ? "No início da jornada, continue assim!" : client.progress && client.progress < 70 ? "Ótimo progresso!" : "Excelente trabalho, quase lá!"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center"><Icons.WorkoutPlan className="mr-2 h-7 w-7 text-primary" /> Meus Planos de Treino</h2>
        {clientWorkoutPlans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {clientWorkoutPlans.map(plan => <ClientWorkoutPlanCard key={plan.id} plan={plan} />)}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Icons.WorkoutPlan className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum plano de treino atribuído ainda. Fale com seu personal trainer!</p>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center"><Icons.Diet className="mr-2 h-7 w-7 text-primary" /> Meus Planos Alimentares</h2>
        {clientDietPlans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {clientDietPlans.map(plan => <ClientDietPlanCard key={plan.id} plan={plan} />)}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Icons.Diet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum plano alimentar atribuído ainda. Fale com seu personal trainer!</p>
          </Card>
        )}
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const [userType, setUserType] = useState<'personal' | 'client' | null>(null);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS); // For trainer
  const [currentClient, setCurrentClient] = useState<Client | null>(null); // For client
  const [clientWorkoutPlans, setClientWorkoutPlans] = useState<WorkoutPlan[]>([]); // For client
  const [clientDietPlans, setClientDietPlans] = useState<DietPlan[]>([]); // For client
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const type = localStorage.getItem('userType') as 'personal' | 'client' | null;
    setUserType(type);

    if (type === 'client') {
      const clientEmail = localStorage.getItem('loggedInClientEmail');
      if (clientEmail) {
        const foundClient = MOCK_CLIENTS.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
        setCurrentClient(foundClient || null);
        if (foundClient) {
          const workoutPlans = MOCK_WORKOUT_PLANS.filter(p => p.clientId === foundClient.id);
          setClientWorkoutPlans(workoutPlans);
          const dietPlans = MOCK_DIET_PLANS.filter(p => p.clientId === foundClient.id);
          setClientDietPlans(dietPlans);
        } else {
          setClientWorkoutPlans([]); 
          setClientDietPlans([]);
        }
      } else {
        setCurrentClient(null);
        setClientWorkoutPlans([]);
        setClientDietPlans([]);
      }
    } else {
      setCurrentClient(null);
      setClientWorkoutPlans([]);
      setClientDietPlans([]);
    }
    setIsLoading(false);
  }, []);

  const handleAddClient = (newClientData: Omit<Client, 'id' | 'avatarUrl' | 'dataAiHint' | 'age' | 'gender' | 'weight' | 'height' | 'fitnessLevel' | 'goals' | 'workoutHistory' | 'progress'>) => {
    const newClient: Client = {
      id: String(Date.now()),
      ...newClientData,
      avatarUrl: 'https://placehold.co/100x100.png',
      dataAiHint: 'new user',
      age: 0,
      gender: 'Other',
      weight: 0,
      height: 0,
      fitnessLevel: 'Beginner',
      goals: 'Não definido ainda.',
      workoutHistory: 'Sem histórico ainda.',
      progress: 0,
    };
    setClients(prevClients => [...prevClients, newClient]);
    MOCK_CLIENTS.push(newClient); // Also update the mock source directly
    toast({
      title: "Cliente Adicionado!",
      description: `${newClient.name} foi adicionado. A senha padrão para o primeiro acesso é "changeme".`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Icons.Activity className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Carregando dashboard...</p>
      </div>
    );
  }

  if (userType === 'client') {
    return <ClientDashboardContent client={currentClient} clientWorkoutPlans={clientWorkoutPlans} clientDietPlans={clientDietPlans} />;
  }

  if (userType === 'personal') {
    return <TrainerDashboardContent clients={clients} onAddClient={handleAddClient} />;
  }

  return (
     <div className="flex h-full items-center justify-center">
        <Icons.Profile className="h-12 w-12 text-muted-foreground" />
        <p className="ml-2">Tipo de usuário não reconhecido. Por favor, faça login novamente.</p>
      </div>
  );
}
