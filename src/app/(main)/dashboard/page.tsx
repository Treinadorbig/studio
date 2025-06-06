
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import type { Client } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { AddClientForm } from '@/components/dashboard/add-client-form';
import { useToast } from '@/hooks/use-toast';

function ClientCard({ client }: { client: Client }) {
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
        <p className="text-sm text-muted-foreground mb-1">Goals: {client.goals.substring(0,50)}...</p>
        <p className="text-sm text-muted-foreground">Level: {client.fitnessLevel}</p>
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={`/clients/${client.id}`}>
              View Profile <Icons.ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddClient = (newClientData: Omit<Client, 'id' | 'avatarUrl' | 'dataAiHint' | 'age' | 'gender' | 'weight' | 'height' | 'fitnessLevel' | 'goals' | 'workoutHistory' | 'progress'>) => {
    const newClient: Client = {
      id: String(Date.now()), // Simple unique ID for mock data
      ...newClientData,
      avatarUrl: 'https://placehold.co/100x100.png',
      dataAiHint: 'new user',
      age: 0, // Default age
      gender: 'Other', // Default gender
      weight: 0, // Default weight
      height: 0, // Default height
      fitnessLevel: 'Beginner',
      goals: 'Not set yet.',
      workoutHistory: 'No history yet.',
      progress: 0,
    };
    setClients(prevClients => [...prevClients, newClient]);
    setIsAddClientDialogOpen(false);
    toast({
      title: "Cliente Adicionado!",
      description: `${newClient.name} foi adicionado. A senha padrão para o primeiro acesso é "changeme".`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline tracking-tight">Client Dashboard</h1>
        <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icons.Add className="mr-2 h-5 w-5" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Insira o nome e e-mail do novo cliente. A senha padrão para o primeiro acesso será &quot;changeme&quot;.
              </DialogDescription>
            </DialogHeader>
            <AddClientForm onSubmit={handleAddClient} onCancel={() => setIsAddClientDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-10 text-center">
           <Icons.Clients className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">No Clients Yet</CardTitle>
          <CardDescription className="mt-2">
            Get started by adding your first client.
          </CardDescription>
           <Button onClick={() => setIsAddClientDialogOpen(true)} className="mt-6">
            <Icons.Add className="mr-2 h-5 w-5" />
            Add New Client
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
