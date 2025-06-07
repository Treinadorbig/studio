
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
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Client } from '@/lib/types';
// MOCK_CLIENTS pode ser removido se não for mais usado para login de cliente
// import { MOCK_CLIENTS } from '@/lib/mock-data'; 

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  userType: z.enum(['personal', 'client'], {
    required_error: "Você precisa selecionar o tipo de usuário.",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'client', 
    },
  });

  async function onSubmit(values: LoginFormValues) {
    console.log('Login attempt with:', values);
    form.clearErrors();
    
    // await new Promise(resolve => setTimeout(resolve, 1000)); 

    let loginSuccessful = false;
    let userName = 'Usuário';

    if (values.userType === 'personal') {
      if (values.password === 'changeme') {
        loginSuccessful = true;
        userName = 'Personal Trainer';
      }
    } else if (values.userType === 'client') {
      if (values.password === 'changeme') { // Mantendo a senha padrão "changeme"
        try {
          const clientsRef = collection(db, 'clients');
          const q = query(clientsRef, where('email', '==', values.email.toLowerCase()));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Cliente encontrado no Firestore
            const clientDoc = querySnapshot.docs[0]; // Pega o primeiro resultado (deve ser único pelo email)
            const clientData = clientDoc.data() as Client;
            loginSuccessful = true;
            userName = clientData.name;
            localStorage.setItem('loggedInClientEmail', clientData.email);
            // Poderíamos também armazenar o clientData.id se necessário
            // localStorage.setItem('loggedInClientId', clientDoc.id);
          }
        } catch (error) {
          console.error("Erro ao verificar cliente no Firestore:", error);
          toast({
            variant: "destructive",
            title: "Erro no Servidor",
            description: "Não foi possível verificar o login. Tente novamente mais tarde.",
          });
          return; // Sai da função em caso de erro no Firestore
        }
      }
    }

    if (loginSuccessful) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', values.userType);
      
      if (values.userType === 'personal') {
        localStorage.removeItem('loggedInClientEmail'); 
        // localStorage.removeItem('loggedInClientId');
      }

      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo(a) de volta ao BigTreino, ${userName}!`,
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: "Email ou senha incorretos, ou tipo de usuário inválido.",
      });
       if (values.userType === 'client' && values.password === 'changeme') {
        form.setError("email", { type: "manual", message: "Cliente não encontrado com este e-mail." });
      } else {
        form.setError("password", { type: "manual", message: "Credenciais inválidas." });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Entrar como:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="personal" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Personal Trainer
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="client" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Cliente
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
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
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Login className="mr-2 h-4 w-4" />
          )}
          Entrar
        </Button>
      </form>
    </Form>
  );
}
