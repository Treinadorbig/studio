
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Importar Input
import { Badge } from '@/components/ui/badge'; // Importar Badge
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface ClientData {
  id: string; // email do cliente
  name: string;
  email: string;
}

interface ClientTrainingAssignments {
  [clientId: string]: string; // clientId (email) -> programId
}

const CLIENT_STORAGE_KEY = 'clientAuthData';
const CLIENT_TRAINING_ASSIGNMENTS_KEY = 'clientTrainingAssignments';

export default function ClientsListPage() {
  const [allClients, setAllClients] = useState<ClientData[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientAssignments, setClientAssignments] = useState<ClientTrainingAssignments>({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined') {
      try {
        const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients).map((client: any) => ({
            id: client.email,
            name: client.name,
            email: client.email,
          }));
          setAllClients(parsedClients);
          setFilteredClients(parsedClients); // Inicialmente, mostrar todos os clientes
        }

        const storedAssignments = localStorage.getItem(CLIENT_TRAINING_ASSIGNMENTS_KEY);
        if (storedAssignments) {
          setClientAssignments(JSON.parse(storedAssignments));
        }

      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar os dados dos clientes ou atribuições.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [isClientMounted, toast]);

  useEffect(() => {
    if (!isClientMounted) return;

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allClients.filter(client => {
      return (
        client.name.toLowerCase().includes(lowercasedFilter) ||
        client.email.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredClients(filtered);
  }, [searchTerm, allClients, isClientMounted]);

  const handleNavigate = (path: string) => {
    router.push(path);
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
        <Input
          placeholder="Buscar cliente por nome ou email..."
          className="mb-4"
          disabled={true}
        />
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

      <Input
        placeholder="Buscar cliente por nome ou email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const isTrainingAssigned = !!clientAssignments[client.id];
            return (
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
                      <DropdownMenuItem onClick={() => handleNavigate(`/clients/${encodeURIComponent(client.id)}/tracking`)}>
                        <Icons.Activity className="mr-2 h-4 w-4" />
                        Acompanhar Cliente
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigate(`/clients/${encodeURIComponent(client.id)}/assign-training`)}>
                        <Icons.WorkoutLibrary className="mr-2 h-4 w-4" />
                        Montar Treino
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleNavigate(`/clients/${encodeURIComponent(client.id)}/edit`)}>
                        <Icons.Edit className="mr-2 h-4 w-4" />
                        Editar Informações
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">Treino:</p>
                    {isTrainingAssigned ? (
                      <Badge variant="secondary">Atribuído</Badge>
                    ) : (
                      <Badge variant="outline">Não Atribuído</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-md rounded-lg">
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center">
              <Icons.Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {allClients.length > 0 && searchTerm ? 'Nenhum Cliente Encontrado' : 'Nenhum Cliente Cadastrado'}
              </h3>
              <p className="text-muted-foreground">
                {allClients.length > 0 && searchTerm
                  ? `Não foram encontrados clientes com o termo "${searchTerm}". Tente uma busca diferente.`
                  : 'Ainda não há clientes cadastrados no sistema.'}
              </p>
              {!(allClients.length > 0 && searchTerm) && (
                <p className="text-sm text-muted-foreground mt-1">
                  Os clientes podem se registrar através da página de cadastro.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
