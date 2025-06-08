
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'Senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Credenciais do Personal Trainer
const PERSONAL_TRAINER_EMAIL = 'treinador@big.com';
const PERSONAL_TRAINER_PASSWORD = '10489810';

const CLIENT_STORAGE_KEY = 'clientAuthData';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de delay

    // 1. Tentar login como Personal Trainer
    if (
      values.email === PERSONAL_TRAINER_EMAIL &&
      values.password === PERSONAL_TRAINER_PASSWORD
    ) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'personal');
      localStorage.setItem('userEmail', values.email);
      toast({
        title: 'Login bem-sucedido!',
        description: 'Bem-vindo, Personal Trainer!',
      });
      router.push('/dashboard');
      setIsLoading(false);
      return;
    }

    // 2. Tentar login como Cliente
    const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
    const clients = storedClients ? JSON.parse(storedClients) : [];
    const clientUser = clients.find(
      (client: any) => client.email === values.email && client.password === values.password
    );

    if (clientUser) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'client');
      localStorage.setItem('userEmail', clientUser.email); // Salva email do cliente
      // localStorage.setItem('userName', clientUser.name); // Poderia salvar o nome também se necessário
      toast({
        title: 'Login bem-sucedido!',
        description: `Bem-vindo(a), ${clientUser.name}!`,
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Erro de Login',
        description: 'Credenciais inválidas. Por favor, tente novamente.',
        variant: 'destructive',
      });
      form.setError('email', { message: ' ' }); 
      form.setError('password', { message: 'Credenciais inválidas.' });
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && (
            <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
          )}
          Entrar
        </Button>
      </form>
    </Form>
  );
}
