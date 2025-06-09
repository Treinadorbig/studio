
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { User as ClientUser } from '@/lib/types';

const CLIENT_STORAGE_KEY = 'clientAuthData';

const editClientSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email().readonly(), // Email will be displayed but not editable
});

type EditClientFormValues = z.infer<typeof editClientSchema>;

export default function EditClientInfoPage() {
  const params = useParams();
  const router = useRouter();
  const encodedClientIdFromParams = params.clientId as string; // This is potentially URL-encoded
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [currentClientName, setCurrentClientName] = useState('');
  
  // Decode the clientId once
  const [decodedClientId, setDecodedClientId] = useState('');

  const form = useForm<EditClientFormValues>({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      name: '',
      email: '', // Will be set after decoding and fetching client
    },
  });

  useEffect(() => {
    setIsClientMounted(true);
    if (encodedClientIdFromParams) {
      setDecodedClientId(decodeURIComponent(encodedClientIdFromParams));
    }
  }, [encodedClientIdFromParams]);

  useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined' && decodedClientId) {
      const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
      if (storedClients) {
        const clients: (ClientUser & { password?: string })[] = JSON.parse(storedClients);
        const clientToEdit = clients.find(c => c.email === decodedClientId); // Use decodedClientId for lookup
        if (clientToEdit) {
          form.reset({ name: clientToEdit.name, email: clientToEdit.email });
          setCurrentClientName(clientToEdit.name);
        } else {
          toast({ title: "Erro", description: "Cliente não encontrado.", variant: "destructive" });
          router.push('/clients');
        }
      }
      setIsLoading(false);
    }
  }, [decodedClientId, isClientMounted, form, router, toast]);

  const onSubmit = async (data: EditClientFormValues) => {
    if (typeof window !== 'undefined' && decodedClientId) {
      setIsSubmitting(true);
      const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
      let clients: (ClientUser & { password?: string })[] = storedClients ? JSON.parse(storedClients) : [];
      
      const clientIndex = clients.findIndex(c => c.email === decodedClientId); // Use decodedClientId for lookup
      if (clientIndex > -1) {
        clients[clientIndex] = { ...clients[clientIndex], name: data.name };
        localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clients));
        toast({
          title: 'Informações Atualizadas!',
          description: `O nome do cliente ${data.name} foi atualizado com sucesso.`,
        });
        setCurrentClientName(data.name);
      } else {
        toast({ title: "Erro ao Atualizar", description: "Não foi possível encontrar o cliente para atualizar.", variant: "destructive" });
      }
      setIsSubmitting(false);
    }
  };

  if (!isClientMounted || isLoading) {
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
              <Icons.Edit className="mr-3 h-8 w-8 text-primary" />
              Editar Informações do Cliente
            </CardTitle>
            <CardDescription>Cliente: {decodedClientId ? decodedClientId : (encodedClientIdFromParams || 'Carregando...')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Icons.Activity className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Carregando informações do cliente...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/clients">
          <Icons.Users className="mr-2 h-4 w-4" />
          Voltar para Lista de Clientes
        </Link>
      </Button>
      <Card className="shadow-lg rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight flex items-center">
                <Icons.Edit className="mr-3 h-8 w-8 text-primary" />
                Editar Informações do Cliente
              </CardTitle>
              <CardDescription>Cliente: {currentClientName || decodedClientId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (não editável)</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do cliente" {...field} readOnly disabled className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground pt-2">
                Observação: A edição de email e senha não está disponível nesta versão para manter a integridade dos dados.
              </p>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
