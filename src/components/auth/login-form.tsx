'use client';

import * import { zodResolver } from '@hookform/resolvers/zod';
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
import { Icons } from '@/components/icons'; // Para ícone de carregamento

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'Senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Credenciais do Personal Trainer
const PERSONAL_TRAINER_EMAIL = 'treinador@big';
const PERSONAL_TRAINER_PASSWORD = '10489810';

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

    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (
      values.email === PERSONAL_TRAINER_EMAIL &&
      values.password === PERSONAL_TRAINER_PASSWORD
    ) {
      // Login de Personal Trainer bem-sucedido
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'personal');
      localStorage.setItem('userEmail', values.email);
      toast({
        title: 'Login bem-sucedido!',
        description: 'Bem-vindo, Personal Trainer!',
      });
      router.push('/dashboard');
    } else {
      // Verificar se é um cliente (lógica futura - por enquanto, falha para outros)
      // Aqui você integraria com o Firebase Auth para clientes
      // Ex: const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      // if (userCredential.user) { /* ... lógica cliente ... */ }
      
      toast({
        title: 'Erro de Login',
        description: 'Credenciais inválidas. Por favor, tente novamente.',
        variant: 'destructive',
      });
      form.setError('email', { message: ' ' }); // Limpa erro específico mas indica falha
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
