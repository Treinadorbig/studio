
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
import type { Client } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { MOCK_CLIENTS } from '@/lib/mock-data'; // Ainda pode ser usado por outras partes do app

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
  path: ["confirmPassword"],
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
      userType: 'client',
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    form.clearErrors(); // Limpa erros anteriores
    console.log('Signup attempt with:', values);
    
    // Simular uma pequena demora, como se fosse uma chamada de API real
    // await new Promise(resolve => setTimeout(resolve, 1000));

    if (values.userType === 'client') {
      try {
        // Verificar se o email já existe no Firestore
        const clientsRef = collection(db, 'clients');
        const q = query(clientsRef, where('email', '==', values.email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          toast({
            variant: "destructive",
            title: "Erro ao Criar Conta",
            description: "Este e-mail já está registrado como cliente.",
          });
          form.setError("email", { type: "manual", message: "Este e-mail já está registrado." });
          return;
        }
        
        // Se o email não existe, criar o novo cliente no Firestore
        const newClientData = {
          name: values.name,
          email: values.email.toLowerCase(),
          // A senha "changeme" não é armazenada diretamente, mas é a convenção para login neste protótipo
          age: 0,
          gender: 'Other' as 'Male' | 'Female' | 'Other',
          weight: 0,
          height: 0,
          fitnessLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
          goals: 'Não definido ainda.',
          avatarUrl: 'https://placehold.co/100x100.png',
          dataAiHint: 'new user',
          workoutHistory: 'Sem histórico ainda.',
          progress: 0,
          createdAt: serverTimestamp(), // Firestore registra a data/hora do servidor
        };

        await addDoc(collection(db, 'clients'), newClientData);
        
        // Opcionalmente, ainda podemos adicionar ao MOCK_CLIENTS se outras partes do app precisarem dele
        // temporariamente, mas a fonte primária agora é o Firestore.
        // MOCK_CLIENTS.push({ ...newClientData, id: String(Date.now()), createdAt: new Date() });


      } catch (error) {
        console.error("Erro ao criar cliente no Firestore:", error);
        toast({
          variant: "destructive",
          title: "Erro no Servidor",
          description: "Não foi possível criar a conta. Tente novamente mais tarde.",
        });
        return;
      }
    }
    // Para 'personal' type, a lógica de signup não muda, pois o login dele já é genérico.

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
