
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface ClientData {
  id: string; // Adicionado para identificar unicamente o cliente, usando o email como ID
  name: string;
  email: string;
}

const CLIENT_STORAGE_KEY = 'clientAuthData';

export default function ClientsListPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined') {
      try {
        const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients).map((client: any, index: number) => ({
            id: client.email, // Usando email como ID único por enquanto
            name: client.name,
            email: client.email,
          }));
          setClients(parsedClients);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes do localStorage:", error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível buscar os dados dos clientes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [isClientMounted, toast]);

  const handleClientAction = (action: string, clientName: string) => {
    toast({
      title: "Ação Selecionada",
      description: `${action}: ${clientName}`,
    });
    // Lógica futura para cada ação virá aqui
  };

  if (!isClientMounted || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Icons.Users className="mr-3 h-8 w-8 text-primary" />
            Meus Clientes
          </h1>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Icons.Activity className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando lista de clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Icons.Users className="mr-3 h-8 w-8 text-primary" />
          Meus Clientes
        </h1>
      </div>
      <Separator />

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="shadow-lg rounded-lg">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Icons.Users className="mr-2 h-5 w-5 text-primary/80" />
                    {client.name}
                  </CardTitle>
                  <CardDescription>{client.email}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icons.Settings className="h-4 w-4" /> 
                      <span className="sr-only">Opções do cliente</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleClientAction('Acompanhar Cliente', client.name)}>
                      <Icons.Activity className="mr-2 h-4 w-4" />
                      Acompanhar Cliente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleClientAction('Montar Treino', client.name)}>
                      <Icons.WorkoutLibrary className="mr-2 h-4 w-4" />
                      Adicione a funcionalidade de montar, ou copiar o treino ou plano de treino da biblioteca para este cliente
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleClientAction('Editar Informações do Cliente', client.name)}>
                      <Icons.Edit className="mr-2 h-4 w-4" />
                      Editar Informações
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mais detalhes e ações específicas estarão disponíveis em breve.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md rounded-lg">
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center">
              <Icons.Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum Cliente Cadastrado</h3>
              <p className="text-muted-foreground">
                Ainda não há clientes cadastrados no sistema.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Os clientes podem se registrar através da página de cadastro.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
