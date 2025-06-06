
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MOCK_CLIENTS, MOCK_EXERCISES, MOCK_WORKOUT_PLANS, MOCK_DIET_PLANS } from '@/lib/mock-data';
import type { Client, AISuggestion, WorkoutPlan, DietPlan } from '@/lib/types';
import { suggestExercises, SuggestExercisesInput } from '@/ai/flows/suggest-exercises';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WorkoutPlanForm } from '@/components/clients/workout-plan-form';
import { DietPlanForm } from '@/components/clients/diet-plan-form';
import { EditClientForm } from '@/components/clients/edit-client-form';


function ClientProfileDisplay({ client, onOpenEditDialog }: { client: Client; onOpenEditDialog: () => void; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Idade</Label><p>{client.age || 'N/A'}</p></div>
          <div><Label>Gênero</Label><p>{client.gender}</p></div>
          <div><Label>Peso</Label><p>{client.weight || 'N/A'} kg</p></div>
          <div><Label>Altura</Label><p>{client.height || 'N/A'} cm</p></div>
          <div><Label>Nível de Fitness</Label><p>{client.fitnessLevel}</p></div>
        </div>
        <div><Label>Metas</Label><p className="whitespace-pre-line">{client.goals || 'Nenhuma meta definida.'}</p></div>
        <div>
          <Label>Histórico de Treinos</Label>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{client.workoutHistory || 'Nenhum histórico fornecido.'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenEditDialog}><Icons.Edit className="mr-2 h-4 w-4" />Editar Perfil</Button>
      </CardContent>
    </Card>
  );
}

function StudentProgressBar({ progress }: { progress: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso Geral</CardTitle>
        <CardDescription>Jornada do cliente em direção às suas metas de fitness.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-full h-4" />
          <span className="text-lg font-semibold text-primary">{progress}%</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {progress < 30 ? "Apenas começando, continue assim!" : progress < 70 ? "Fazendo bons progressos!" : "Excelente trabalho, perto das metas!"}
        </p>
      </CardContent>
    </Card>
  );
}

function AiSuggestionsSection({ client }: { client: Client }) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [clientProfileInput, setClientProfileInput] = useState(
    `Idade: ${client.age}, Gênero: ${client.gender}, Peso: ${client.weight}kg, Altura: ${client.height}cm, Nível de Fitness: ${client.fitnessLevel}`
  );
  const [goalsInput, setGoalsInput] = useState(client.goals);
  const [historyInput, setHistoryInput] = useState(client.workoutHistory || '');

   useEffect(() => {
    setClientProfileInput(`Idade: ${client.age}, Gênero: ${client.gender}, Peso: ${client.weight}kg, Altura: ${client.height}cm, Nível de Fitness: ${client.fitnessLevel}`);
    setGoalsInput(client.goals);
    setHistoryInput(client.workoutHistory || '');
  }, [client]);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const input: SuggestExercisesInput = {
      clientProfile: clientProfileInput,
      goals: goalsInput,
      workoutHistory: historyInput,
    };

    try {
      const result = await suggestExercises(input);
      if (result && result.suggestedExercises) {
        setSuggestions(result.suggestedExercises as AISuggestion[]);
        toast({ title: "Sugestões da IA", description: "Sugestões de treino geradas com sucesso!" });
      } else {
        setError("Nenhuma sugestão recebida da IA.");
        toast({ variant: "destructive", title: "Erro da IA", description: "Nenhuma sugestão recebida." });
      }
    } catch (e) {
      console.error("Erro ao buscar sugestões da IA:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao obter sugestões da IA: ${errorMessage}`);
      toast({ variant: "destructive", title: "Erro da IA", description: `Falha ao obter sugestões: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icons.Brain className="h-6 w-6 text-primary" /> Sugestões de Treino da IA</CardTitle>
        <CardDescription>Deixe a IA ajudar a criar o plano de treino perfeito para {client.name}. Forneça ou atualize os detalhes do cliente abaixo para sugestões personalizadas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientProfile">Resumo do Perfil do Cliente</Label>
            <Textarea id="clientProfile" value={clientProfileInput} onChange={(e) => setClientProfileInput(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientGoals">Metas de Fitness</Label>
            <Textarea id="clientGoals" value={goalsInput} onChange={(e) => setGoalsInput(e.target.value)} rows={4} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="workoutHistory">Histórico de Treinos</Label>
          <Textarea id="workoutHistory" value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} placeholder="Ex: Agachamento 3x10 @ 50kg, Supino 3x8 @ 30kg..." rows={3} />
        </div>
        
        <Button onClick={handleGetSuggestions} disabled={isLoading}>
          {isLoading ? (
            <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Brain className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Gerando...' : 'Obter Sugestões da IA'}
        </Button>

        {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Exercícios Sugeridos:</h3>
            {suggestions.map((s, index) => (
              <Card key={index} className="bg-secondary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{s.exerciseName}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Séries:</strong> {s.sets}</p>
                  <p><strong>Reps:</strong> {s.reps}</p>
                  <p><strong>Peso:</strong> {s.weight}</p>
                  <p className="text-muted-foreground pt-1"><strong>Motivo:</strong> {s.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WorkoutPlansSection({ client, plans, onSavePlan, onDeletePlan }: { 
  client: Client; 
  plans: WorkoutPlan[];
  onSavePlan: (plan: WorkoutPlan) => void;
  onDeletePlan: (planId: string) => void;
}) {
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();

  const handleOpenCreateForm = () => {
    setPlanToEdit(null);
    setIsPlanFormOpen(true);
  };

  const handleOpenEditForm = (plan: WorkoutPlan) => {
    setPlanToEdit(plan);
    setIsPlanFormOpen(true);
  };

  const handleFormSubmit = (data: WorkoutPlan) => {
    onSavePlan(data);
    setIsPlanFormOpen(false);
    setPlanToEdit(null);
    toast({ title: "Plano de Treino Salvo!", description: `Plano "${data.name}" foi salvo com sucesso.` });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Planos de Treino do Cliente</CardTitle>
          <CardDescription>Gerencie e crie rotinas de treino para {client.name}.</CardDescription>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Icons.Add className="mr-2 h-4 w-4" /> Criar Novo Plano
        </Button>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <div className="text-center py-8">
            <Icons.WorkoutPlan className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum plano de treino criado para este cliente ainda.</p>
            <Button onClick={handleOpenCreateForm} className="mt-4">Criar Primeiro Plano</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <Card key={plan.id} className="bg-secondary/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleOpenEditForm(plan)}>
                        <Icons.Edit className="mr-2 h-4 w-4" /> Editar
                      </Button>
                       <Button variant="destructive" size="sm" onClick={() => onDeletePlan(plan.id)}>
                        <Icons.Delete className="mr-2 h-4 w-4" /> Excluir
                      </Button>
                    </div>
                  </div>
                  {plan.description && <CardDescription>{plan.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.items.map((item, index) => (
                      <li key={index} className="text-sm border-b border-border pb-1 last:border-b-0">
                        <strong>{item.exerciseName}</strong>: {item.sets} séries de {item.reps} reps. 
                        {item.rest && ` Descanso: ${item.rest}`}
                        {item.notes && <p className="text-xs text-muted-foreground pl-2"><em>Notas: {item.notes}</em></p>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={isPlanFormOpen} onOpenChange={setIsPlanFormOpen}>
         <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{planToEdit ? 'Editar Plano de Treino' : 'Criar Novo Plano de Treino'}</DialogTitle>
            <DialogDescription>
              {planToEdit ? `Modificando plano: ${planToEdit.name}` : `Defina uma nova rotina de treino para ${client.name}.`}
            </DialogDescription>
          </DialogHeader>
           <div className="overflow-y-auto flex-grow pr-2">
            <WorkoutPlanForm 
              client={client}
              planToEdit={planToEdit} 
              onSubmit={handleFormSubmit} 
              onCancel={() => { setIsPlanFormOpen(false); setPlanToEdit(null); }} 
              availableExercises={MOCK_EXERCISES}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DietPlansSection({ client, plans, onSavePlan, onDeletePlan }: { 
  client: Client; 
  plans: DietPlan[];
  onSavePlan: (plan: DietPlan) => void;
  onDeletePlan: (planId: string) => void;
}) {
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<DietPlan | null>(null);
  const { toast } = useToast();

  const handleOpenCreateForm = () => {
    setPlanToEdit(null);
    setIsPlanFormOpen(true);
  };

  const handleOpenEditForm = (plan: DietPlan) => {
    setPlanToEdit(plan);
    setIsPlanFormOpen(true);
  };

  const handleFormSubmit = (data: DietPlan) => {
    onSavePlan(data);
    setIsPlanFormOpen(false);
    setPlanToEdit(null);
    toast({ title: "Plano Alimentar Salvo!", description: `Plano "${data.name}" foi salvo com sucesso.` });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Planos Alimentares do Cliente</CardTitle>
          <CardDescription>Gerencie e crie planos alimentares para {client.name}.</CardDescription>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <Icons.Add className="mr-2 h-4 w-4" /> Criar Novo Plano Alimentar
        </Button>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <div className="text-center py-8">
            <Icons.Diet className="h-16 w-16 text-muted-foreground mx-auto mb-4" /> 
            <p className="text-muted-foreground">Nenhum plano alimentar criado para este cliente ainda.</p>
            <Button onClick={handleOpenCreateForm} className="mt-4">Criar Primeiro Plano Alimentar</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <Card key={plan.id} className="bg-secondary/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleOpenEditForm(plan)}>
                        <Icons.Edit className="mr-2 h-4 w-4" /> Editar
                      </Button>
                       <Button variant="destructive" size="sm" onClick={() => onDeletePlan(plan.id)}>
                        <Icons.Delete className="mr-2 h-4 w-4" /> Excluir
                      </Button>
                    </div>
                  </div>
                  {plan.description && <CardDescription>{plan.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {plan.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="mb-3 last:mb-0">
                      <h4 className="font-semibold text-md mb-1">
                        {meal.mealName} {meal.time && <span className="text-sm text-muted-foreground">({meal.time})</span>}
                      </h4>
                      <ul className="space-y-1 pl-4">
                        {meal.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm border-b border-border/50 pb-1 last:border-b-0">
                            <strong>{item.foodName}</strong>: {item.quantity}
                            {item.notes && <p className="text-xs text-muted-foreground pl-2"><em>Notas: {item.notes}</em></p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={isPlanFormOpen} onOpenChange={setIsPlanFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{planToEdit ? 'Editar Plano Alimentar' : 'Criar Novo Plano Alimentar'}</DialogTitle>
            <DialogDescription>
              {planToEdit ? `Modificando plano: ${planToEdit.name}` : `Defina um novo plano alimentar para ${client.name}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-grow pr-2">
            <DietPlanForm 
              client={client}
              planToEdit={planToEdit} 
              onSubmit={handleFormSubmit} 
              onCancel={() => { setIsPlanFormOpen(false); setPlanToEdit(null); }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}


export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<Client | null>(null);
  const [clientWorkoutPlans, setClientWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [clientDietPlans, setClientDietPlans] = useState<DietPlan[]>([]);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  useEffect(() => {
    const foundClient = MOCK_CLIENTS.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
      const workoutPlans = MOCK_WORKOUT_PLANS.filter(p => p.clientId === clientId);
      setClientWorkoutPlans(workoutPlans);
      const dietPlans = MOCK_DIET_PLANS.filter(p => p.clientId === clientId);
      setClientDietPlans(dietPlans);

      // Handle tab selection from URL hash
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        if (hash === 'workout' || hash === 'diet' || hash === 'profile') {
          setActiveTab(hash);
        }
      }

    } else {
      // Optionally, show a toast message or redirect if client not found
      // For now, just pushing to dashboard which might not be ideal if accessed via direct link.
      // Consider a dedicated 404 or error page in a real app.
      router.push('/dashboard'); 
    }
  }, [clientId, router]);


  const handleUpdateClientDetails = (updatedData: Partial<Client>) => {
    if (!client) return;
  
    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === client.id);
    if (clientIndex > -1) {
      const fullyUpdatedClient = { ...MOCK_CLIENTS[clientIndex], ...updatedData } as Client;
      MOCK_CLIENTS[clientIndex] = fullyUpdatedClient;
      setClient(fullyUpdatedClient); 
    }
    setIsEditClientDialogOpen(false);
    toast({ title: "Perfil Atualizado", description: `Os detalhes de ${updatedData.name || client.name} foram salvos.` });
  };

  const handleSaveWorkoutPlan = (planData: WorkoutPlan) => {
    const existingPlanIndex = MOCK_WORKOUT_PLANS.findIndex(p => p.id === planData.id && p.clientId === clientId);
    if (existingPlanIndex > -1) {
      MOCK_WORKOUT_PLANS[existingPlanIndex] = planData;
    } else {
      const newPlanWithId = { ...planData, id: planData.id || `wp_${Date.now()}_${clientId}`};
      MOCK_WORKOUT_PLANS.push(newPlanWithId);
    }
    setClientWorkoutPlans(MOCK_WORKOUT_PLANS.filter(p => p.clientId === clientId));
  };

  const handleDeleteWorkoutPlan = (planId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este plano de treino?")) {
      const planIndex = MOCK_WORKOUT_PLANS.findIndex(p => p.id === planId && p.clientId === clientId);
      if (planIndex > -1) {
        MOCK_WORKOUT_PLANS.splice(planIndex, 1);
      }
      setClientWorkoutPlans(MOCK_WORKOUT_PLANS.filter(p => p.clientId === clientId));
      toast({ title: "Plano de Treino Excluído", description: "O plano de treino foi removido.", variant: "destructive" });
    }
  };

  const handleSaveDietPlan = (planData: DietPlan) => {
    const existingPlanIndex = MOCK_DIET_PLANS.findIndex(p => p.id === planData.id && p.clientId === clientId);
    if (existingPlanIndex > -1) {
      MOCK_DIET_PLANS[existingPlanIndex] = planData;
    } else {
      const newPlanWithId = { ...planData, id: planData.id || `dp_${Date.now()}_${clientId}`};
      MOCK_DIET_PLANS.push(newPlanWithId);
    }
    setClientDietPlans(MOCK_DIET_PLANS.filter(p => p.clientId === clientId));
  };

  const handleDeleteDietPlan = (planId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este plano alimentar?")) {
      const planIndex = MOCK_DIET_PLANS.findIndex(p => p.id === planId && p.clientId === clientId);
      if (planIndex > -1) {
        MOCK_DIET_PLANS.splice(planIndex, 1);
      }
      setClientDietPlans(MOCK_DIET_PLANS.filter(p => p.clientId === clientId));
      toast({ title: "Plano Alimentar Excluído", description: "O plano alimentar foi removido.", variant: "destructive" });
    }
  };


  if (!client) {
    return (
      <div className="flex h-full items-center justify-center">
        <Icons.Activity className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Carregando dados do cliente...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <Icons.ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Voltar</span>
        </Button>
        <Avatar className="h-16 w-16">
          <AvatarImage src={client.avatarUrl} alt={client.name} data-ai-hint={client.dataAiHint}/>
          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-headline tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">{client.email}</p>
        </div>
      </div>
      
      <StudentProgressBar progress={client.progress || 0} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-3"> 
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="workout">Treinos</TabsTrigger>
          <TabsTrigger value="diet">Dieta</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <ClientProfileDisplay client={client} onOpenEditDialog={() => setIsEditClientDialogOpen(true)} />
        </TabsContent>
        <TabsContent value="workout" className="mt-4 space-y-6">
          <WorkoutPlansSection 
            client={client} 
            plans={clientWorkoutPlans} 
            onSavePlan={handleSaveWorkoutPlan}
            onDeletePlan={handleDeleteWorkoutPlan}
          />
          <AiSuggestionsSection client={client} />
        </TabsContent>
        <TabsContent value="diet" className="mt-4">
           <DietPlansSection
            client={client}
            plans={clientDietPlans}
            onSavePlan={handleSaveDietPlan}
            onDeletePlan={handleDeleteDietPlan}
           />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <DialogContent className="sm:max-w-[625px]"> 
          <DialogHeader>
            <DialogTitle>Editar Perfil do Cliente</DialogTitle>
            {client && <DialogDescription>Modifique os detalhes de {client.name}.</DialogDescription>}
          </DialogHeader>
          {client && (
            <EditClientForm
              client={client}
              onSubmit={handleUpdateClientDetails}
              onCancel={() => setIsEditClientDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

    