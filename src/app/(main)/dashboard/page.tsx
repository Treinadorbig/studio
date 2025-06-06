'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import type { Client } from '@/lib/types';

function ClientCard({ client }: { client: Client }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={client.avatarUrl} alt={client.name} data-ai-hint={client.dataAiHint} />
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
  // In a real app, you'd fetch clients from an API
  const clients = MOCK_CLIENTS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline tracking-tight">Client Dashboard</h1>
        <Button>
          <Icons.Add className="mr-2 h-5 w-5" />
          Add New Client
        </Button>
      </div>
      
      {clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-10 text-center">
           <Icons.Clients className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">No Clients Yet</CardTitle>
          <CardDescription className="mt-2">
            Get started by adding your first client.
          </CardDescription>
          <Button className="mt-6">
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
