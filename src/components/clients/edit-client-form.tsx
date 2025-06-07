
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Icons } from '@/components/icons';
import type { Client } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

// Este schema representa os dados do formulário. O 'id' é incluído aqui
// porque faz parte dos defaultValues do formulário, mas será removido antes de enviar para o Firestore.
const editClientFormSchema = z.object({
  id: z.string(), 
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  age: z.coerce.number().min(0, { message: 'Idade não pode ser negativa.' }).optional(),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Selecione o gênero.' }),
  weight: z.coerce.number().min(0, { message: 'Peso não pode ser negativo.' }).optional(),
  height: z.coerce.number().min(0, { message: 'Altura não pode ser negativa.' }).optional(),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], { required_error: 'Selecione o nível de fitness.' }),
  goals: z.string().optional(),
  workoutHistory: z.string().optional(),
});

// Exporta o tipo para que a página pai possa usá-lo
export type EditClientFormValues = z.infer<typeof editClientFormSchema>;

interface EditClientFormProps {
  client: Client;
  onSubmit: (data: EditClientFormValues) => void;
  onCancel: () => void;
}

export function EditClientForm({ client, onSubmit, onCancel }: EditClientFormProps) {
  const form = useForm<EditClientFormValues>({
    resolver: zodResolver(editClientFormSchema),
    defaultValues: {
      id: client.id,
      name: client.name || '',
      email: client.email || '',
      age: client.age || undefined, // Usar undefined para que z.coerce.number().optional() funcione corretamente
      gender: client.gender || 'Other',
      weight: client.weight || undefined,
      height: client.height || undefined,
      fitnessLevel: client.fitnessLevel || 'Beginner',
      goals: client.goals || '',
      workoutHistory: client.workoutHistory || '',
    },
  });

  useEffect(() => {
    form.reset({
      id: client.id,
      name: client.name || '',
      email: client.email || '',
      age: client.age || undefined,
      gender: client.gender || 'Other',
      weight: client.weight || undefined,
      height: client.height || undefined,
      fitnessLevel: client.fitnessLevel || 'Beginner',
      goals: client.goals || '',
      workoutHistory: client.workoutHistory || '',
    });
  }, [client, form]);

  const handleFormSubmit = (values: EditClientFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="max-h-[calc(80vh-120px)] pr-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
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
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      {/* O valor será string vazia se undefined, Zod coerce cuidará da conversão */}
                      <Input type="number" placeholder="Ex: 30" {...field} value={field.value === undefined ? '' : field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-3 pt-2"
                    >
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl><RadioGroupItem value="Male" /></FormControl>
                        <FormLabel className="font-normal">Masculino</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl><RadioGroupItem value="Female" /></FormControl>
                        <FormLabel className="font-normal">Feminino</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl><RadioGroupItem value="Other" /></FormControl>
                        <FormLabel className="font-normal">Outro</FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 70" {...field} value={field.value === undefined ? '' : field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 175" {...field} value={field.value === undefined ? '' : field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Fitness</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Iniciante</SelectItem>
                      <SelectItem value="Intermediate">Intermediário</SelectItem>
                      <SelectItem value="Advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva as metas do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workoutHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Histórico de Treinos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o histórico de treinos do cliente" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}
