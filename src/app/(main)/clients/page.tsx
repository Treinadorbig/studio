
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

interface ClientData {
  name: string;
  email: string;
  // A senha não é incluída aqui por segurança e porque não é necessária para exibição
}

const CLIENT_STORAGE_KEY = 'clientAuthData';

export default function ClientsListPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined') {
      try {
        const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
        if (storedClients) {
          // Parse e mapeie para ClientData, omitindo a senha
          const parsedClients = JSON.parse(storedClients).map((client: any) => ({
            name: client.name,
            email: client.email,
          }));
          setClients(parsedClients);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes do localStorage:", error);
        // Tratar erro, talvez mostrar um toast
      } finally {
        setIsLoading(false);
      }
    }
  }, [isClientMounted]);

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
        {/* Futuramente, um botão para adicionar cliente manualmente poderia vir aqui */}
      </div>
      <Separator />

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <Card key={index} className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Icons.Users className="mr-2 h-5 w-5 text-primary/80" /> 
                  {client.name}
                </CardTitle>
                <CardDescription>{client.email}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Futuramente, adicionar mais detalhes ou ações como "Ver Detalhes" */}
                <p className="text-sm text-muted-foreground">
                  Mais detalhes do cliente estarão disponíveis em breve.
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
