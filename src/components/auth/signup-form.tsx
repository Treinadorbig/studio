
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MOCK_CLIENTS } from '@/lib/mock-data';
import type { Client } from '@/lib/types';

const signUpFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres.' }),
  userType: z.enum(['personal', 'client'], {
    required_error: "Você precisa selecionar o tipo de usuário.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"], // Path to show error on confirmPassword field
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'client', // Default to client
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    console.log('Signup attempt with:', values);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    if (values.userType === 'client') {
      const existingClient = MOCK_CLIENTS.find(client => client.email.toLowerCase() === values.email.toLowerCase());
      if (existingClient) {
        toast({
          variant: "destructive",
          title: "Erro ao Criar Conta",
          description: "Este e-mail já está registrado como cliente.",
        });
        return;
      }
      
      const newClient: Client = {
        id: String(Date.now()), // Simple unique ID
        name: values.name,
        email: values.email,
        // password: "changeme", // Not storing password directly in MOCK_CLIENTS for this prototype
        age: 0, // Default values, user can edit later
        gender: 'Other',
        weight: 0,
        height: 0,
        fitnessLevel: 'Beginner',
        goals: 'Não definido ainda.',
        avatarUrl: 'https://placehold.co/100x100.png',
        dataAiHint: 'new user',
        workoutHistory: 'Sem histórico ainda.',
        progress: 0,
      };
      MOCK_CLIENTS.push(newClient);
      console.log('New client added to MOCK_CLIENTS:', newClient);
      console.log('MOCK_CLIENTS current state:', MOCK_CLIENTS);
    }
    // For 'personal' type, we don't need to add to any list for this prototype,
    // as the login logic already allows any email with 'changeme' password.

    toast({
      title: "Conta Criada com Sucesso!",
      description: `Bem-vindo(a) ${values.name}! Você já pode fazer login.`,
    });
    router.push('/login');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="voce@exemplo.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Quero me registrar como:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="client" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Cliente
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="personal" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Personal Trainer
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Add className="mr-2 h-4 w-4" />
          )}
          Criar Conta
        </Button>
      </form>
    </Form>
  );
}
