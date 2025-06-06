'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MOCK_CLIENTS, MOCK_EXERCISES } from '@/lib/mock-data';
import type { Client, AISuggestion } from '@/lib/types';
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


function ClientProfileDisplay({ client }: { client: Client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Age</Label><p>{client.age}</p></div>
          <div><Label>Gender</Label><p>{client.gender}</p></div>
          <div><Label>Weight</Label><p>{client.weight} kg</p></div>
          <div><Label>Height</Label><p>{client.height} cm</p></div>
          <div><Label>Fitness Level</Label><p>{client.fitnessLevel}</p></div>
        </div>
        <div><Label>Goals</Label><p className="whitespace-pre-line">{client.goals}</p></div>
        <div>
          <Label>Workout History</Label>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{client.workoutHistory || 'No history provided.'}</p>
        </div>
        <Button variant="outline" size="sm"><Icons.Edit className="mr-2 h-4 w-4" />Edit Profile</Button>
      </CardContent>
    </Card>
  );
}

function StudentProgressBar({ progress }: { progress: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
        <CardDescription>Client's journey towards their fitness goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-full h-4" />
          <span className="text-lg font-semibold text-primary">{progress}%</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {progress < 30 ? "Just starting out, keep it up!" : progress < 70 ? "Making good strides!" : "Excellent work, nearing goals!"}
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
    `Age: ${client.age}, Gender: ${client.gender}, Weight: ${client.weight}kg, Height: ${client.height}cm, Fitness Level: ${client.fitnessLevel}`
  );
  const [goalsInput, setGoalsInput] = useState(client.goals);
  const [historyInput, setHistoryInput] = useState(client.workoutHistory || '');

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
        toast({ title: "AI Suggestions", description: "Workout suggestions generated successfully!" });
      } else {
        setError("No suggestions received from AI.");
        toast({ variant: "destructive", title: "AI Error", description: "No suggestions received." });
      }
    } catch (e) {
      console.error("Error fetching AI suggestions:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get AI suggestions: ${errorMessage}`);
      toast({ variant: "destructive", title: "AI Error", description: `Failed to get suggestions: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icons.Brain className="h-6 w-6 text-primary" /> AI Workout Suggestions</CardTitle>
        <CardDescription>Let AI help you design the perfect workout plan for {client.name}. Provide or update client details below for tailored suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientProfile">Client Profile Summary</Label>
            <Textarea id="clientProfile" value={clientProfileInput} onChange={(e) => setClientProfileInput(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientGoals">Fitness Goals</Label>
            <Textarea id="clientGoals" value={goalsInput} onChange={(e) => setGoalsInput(e.target.value)} rows={4} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="workoutHistory">Workout History</Label>
          <Textarea id="workoutHistory" value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} placeholder="e.g., Squats 3x10 @ 50kg, Bench Press 3x8 @ 30kg..." rows={3} />
        </div>
        
        <Button onClick={handleGetSuggestions} disabled={isLoading}>
          {isLoading ? (
            <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Brain className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Generating...' : 'Get AI Suggestions'}
        </Button>

        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Suggested Exercises:</h3>
            {suggestions.map((s, index) => (
              <Card key={index} className="bg-secondary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{s.exerciseName}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Sets:</strong> {s.sets}</p>
                  <p><strong>Reps:</strong> {s.reps}</p>
                  <p><strong>Weight:</strong> {s.weight}</p>
                  <p className="text-muted-foreground pt-1"><strong>Reason:</strong> {s.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const foundClient = MOCK_CLIENTS.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
    } else {
      // Handle client not found, e.g., redirect or show error
      router.push('/dashboard'); // Or a 404 page
    }
  }, [clientId, router]);

  if (!client) {
    return (
      <div className="flex h-full items-center justify-center">
        <Icons.Activity className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading client data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <Icons.ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workout">Workout Plan</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <ClientProfileDisplay client={client} />
        </TabsContent>
        <TabsContent value="workout" className="mt-4">
          <AiSuggestionsSection client={client} />
          {/* Placeholder for current workout plan display and builder */}
          <Card className="mt-6">
            <CardHeader><CardTitle>Current Workout Plan</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Workout plan builder UI will be here.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
           <Card>
            <CardHeader><CardTitle>Workout Schedule</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Scheduling and reminders UI will be here.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="mt-4">
           <Card>
            <CardHeader><CardTitle>Trainer Notes & Client Feedback</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Feedback and notes section UI will be here.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
