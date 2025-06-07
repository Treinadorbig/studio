
'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { MOCK_WORKOUT_PLANS, MOCK_DIET_PLANS } from '@/lib/mock-data'; // Exercises will still come from mock for now
import type { Client, WorkoutPlan, DietPlan } from '@/lib/types';
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

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

// Trainer's View Components
function TrainerClientCard({ client }: { client: Client }) {
  const clientWorkoutPlans = MOCK_WORKOUT_PLANS.filter(plan => plan.clientId === client.id);
  const planSummary = clientWorkoutPlans.length > 0
    ? clientWorkoutPlans.map(plan => {
        let namePart = plan.name;
        namePart = namePart.replace(/^(Treino|Plano|Dia)\s*([A-Za-z0-9]+)\s*-\s*/i, '$2: ');
        namePart = namePart.replace(/^(Treino|Plano|Dia)\s+/i, '');
        
        if (namePart.length > 20) namePart = namePart.substring(0, 17) + '...';
        return namePart;
      }).slice(0, 2).join(' | ')
    : 'Nenhum plano ativo';

  const displayGoals = client.goals.length > 50 ? client.goals.substring(0, 47) + '...' : client.goals;

  return (
    <Card className="hover:shadow-md transition-shadow duration-150 animate-fade-in flex flex-col w-full">
      <CardHeader className="flex flex-row items-center gap-3 p-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={client.avatarUrl} alt={client.name} data-ai-hint={client.dataAiHint || 'user avatar'} />
          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-base font-semibold font-headline flex-grow truncate">{client.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1.5 flex-grow">
        <div className="mb-1">
          <p className="text-xs font-medium text-muted-foreground">Metas:</p>
          <p className="text-xs text-foreground h-8 overflow-y-hidden">{displayGoals}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Planos:</p>
          <p className="text-xs text-foreground truncate">{planSummary}</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-2 flex justify-end">
          <Button asChild variant="ghost" size="sm" className="text-xs h-7 px-2">
            <Link href={`/clients/${client.id}`}>
              Detalhes <Icons.ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}

function TrainerDashboardContent({ clients, onAddClient, loadingClients }: { clients: Client[], onAddClient: (data: Omit<Client, 'id' | 'avatarUrl' | 'dataAiHint' | 'age' | 'gender' | 'weight' | 'height' | 'fitnessLevel' | 'goals' | 'workoutHistory' | 'progress' | 'createdAt'>) => void, loadingClients: boolean }) {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline tracking-tight">Olá, Big, tudo bem?</h1>
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
      
      {loadingClients && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <Icons.Activity className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      )}

      {!loadingClients && clients.length === 0 && (
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
      )}

      {!loadingClients && clients.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          {clients.map((client) => (
            <TrainerClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}

// Client's View Components (Unchanged for now)
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
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={`/clients/${plan.clientId}#workout`}>
            <Icons.WorkoutPlan className="mr-2 h-4 w-4" /> Ver Detalhes do Treino
          </Link>
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
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={`/clients/${plan.clientId}#diet`}>
            <Icons.Diet className="mr-2 h-4 w-4" /> Ver Detalhes da Dieta
          </Link>
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
  const [clients, setClients] = useState<Client[]>([]); 
  const [loadingClients, setLoadingClients] = useState(true);
  const [currentClient, setCurrentClient] = useState<Client | null>(null); 
  const [clientWorkoutPlans, setClientWorkoutPlans] = useState<WorkoutPlan[]>([]); 
  const [clientDietPlans, setClientDietPlans] = useState<DietPlan[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClientsFromFirestore = useCallback(async () => {
    if (userType === 'personal') {
      setLoadingClients(true);
      try {
        const clientsCollection = collection(db, 'clients');
        const q = query(clientsCollection, orderBy('createdAt', 'desc'));
        const clientSnapshot = await getDocs(q);
        const clientsList = clientSnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamp to Date if necessary, or keep as is if your type expects Timestamp
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt;
          return { ...data, id: doc.id, createdAt } as Client;
        });
        setClients(clientsList);
      } catch (error) {
        console.error("Error fetching clients from Firestore:", error);
        toast({
          variant: "destructive",
          title: "Erro ao Carregar Clientes",
          description: "Não foi possível buscar os clientes do banco de dados.",
        });
      } finally {
        setLoadingClients(false);
      }
    }
  }, [userType, toast]);


  useEffect(() => {
    const type = localStorage.getItem('userType') as 'personal' | 'client' | null;
    setUserType(type);
    setIsLoading(false); // General loading for page structure

    if (type === 'personal') {
      fetchClientsFromFirestore();
    } else if (type === 'client') {
      // Client-specific data fetching (from mock for now, will also move to Firestore later)
      const clientEmail = localStorage.getItem('loggedInClientEmail');
      if (clientEmail) {
        // This part will need to fetch client data from Firestore in a future step
        // For now, it might rely on MOCK_CLIENTS if it's still imported and used for client login.
        // Or better, show loading / error if client not found from a Firestore query.
        // To keep this step focused, we'll assume currentClient data handling for client view is separate.
        // const foundClient = MOCK_CLIENTS.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
        // setCurrentClient(foundClient || null);
        // if (foundClient) {
        //   setClientWorkoutPlans(MOCK_WORKOUT_PLANS.filter(p => p.clientId === foundClient.id));
        //   setClientDietPlans(MOCK_DIET_PLANS.filter(p => p.clientId === foundClient.id));
        // }
        // For now, let's leave client view data loading as is.
        setLoadingClients(false); // No clients to load for client view here
      } else {
         setLoadingClients(false);
      }
    } else {
       setLoadingClients(false);
    }
  }, [userType, fetchClientsFromFirestore]);

  // Effect for client-specific data (placeholder, as this part will also need Firestore integration)
   useEffect(() => {
    if (userType === 'client') {
      const clientEmail = localStorage.getItem('loggedInClientEmail');
      // This is where you would fetch specific client details, their plans etc. from Firestore.
      // For now, it's simplified.
      // const foundClient = MOCK_CLIENTS.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
      // setCurrentClient(foundClient || null);
      // setClientWorkoutPlans(foundClient ? MOCK_WORKOUT_PLANS.filter(p => p.clientId === foundClient.id) : []);
      // setClientDietPlans(foundClient ? MOCK_DIET_PLANS.filter(p => p.clientId === foundClient.id) : []);
       setIsLoading(false); // Stop general loading
       setLoadingClients(false); // Stop client-specific loading
    }
  }, [userType]);


  const handleAddClient = async (newClientData: Omit<Client, 'id' | 'avatarUrl' | 'dataAiHint' | 'age' | 'gender' | 'weight' | 'height' | 'fitnessLevel' | 'goals' | 'workoutHistory' | 'progress' | 'createdAt'>) => {
    const clientToAdd = {
      ...newClientData,
      avatarUrl: 'https://placehold.co/100x100.png',
      dataAiHint: 'new user',
      age: 0,
      gender: 'Other' as 'Male' | 'Female' | 'Other',
      weight: 0,
      height: 0,
      fitnessLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
      goals: 'Não definido ainda.',
      workoutHistory: 'Sem histórico ainda.',
      progress: 0,
      createdAt: serverTimestamp(), // Firestore server-side timestamp
    };

    try {
      const clientsCollection = collection(db, 'clients');
      await addDoc(clientsCollection, clientToAdd);
      toast({
        title: "Cliente Adicionado!",
        description: `${newClientData.name} foi adicionado com sucesso ao Firestore.`,
      });
      fetchClientsFromFirestore(); // Re-fetch clients to update the list
    } catch (error) {
      console.error("Error adding client to Firestore: ", error);
      toast({
        variant: "destructive",
        title: "Erro ao Adicionar Cliente",
        description: "Não foi possível salvar o cliente no banco de dados.",
      });
    }
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
    // Client view still relies on mock data for workout/diet plans for now.
    // The currentClient data itself would ideally also come from Firestore.
    // This part of the logic (fetching currentClient, MOCK_WORKOUT_PLANS, MOCK_DIET_PLANS)
    // is simplified for this step and will be addressed in future Firestore integrations for client view.
    const loggedInEmail = typeof window !== 'undefined' ? localStorage.getItem('loggedInClientEmail') : null;
    // const mockClientForView = loggedInEmail ? MOCK_CLIENTS.find(c => c.email.toLowerCase() === loggedInEmail.toLowerCase()) : null;
    
    // For now, let's keep the client view showing a placeholder or minimal data
    // as it needs its own Firestore fetching logic.
     return <ClientDashboardContent client={currentClient} clientWorkoutPlans={clientWorkoutPlans} clientDietPlans={clientDietPlans} />;
  }

  if (userType === 'personal') {
    return <TrainerDashboardContent clients={clients} onAddClient={handleAddClient} loadingClients={loadingClients} />;
  }

  return (
     <div className="flex h-full items-center justify-center">
        <Icons.Profile className="h-12 w-12 text-muted-foreground" />
        <p className="ml-2">Tipo de usuário não reconhecido. Por favor, faça login novamente.</p>
      </div>
  );
}
