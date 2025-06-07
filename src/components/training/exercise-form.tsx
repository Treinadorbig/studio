
'use client';

import type { Exercise } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useState } from 'react';

const exerciseSchema = z.object({
  name: z.string().min(3, { message: 'Nome do exercício deve ter pelo menos 3 caracteres.' }).max(100),
  series: z.string().min(1, { message: 'Séries são obrigatórias.' }).max(20),
  repetitions: z.string().min(1, { message: 'Repetições são obrigatórias.' }).max(50),
  interval: z.string().min(1, { message: 'Intervalo é obrigatório.' }).max(50),
  observations: z.string().max(500).optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

interface ExerciseFormProps {
  onSave: (exercise: Omit<Exercise, 'id'>) => void;
  // initialData?: Exercise; // Para edição futura
}

export function ExerciseForm({ onSave }: ExerciseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: '',
      series: '',
      repetitions: '',
      interval: '',
      observations: '',
    },
  });

  async function onSubmit(values: ExerciseFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
    onSave(values);
    form.reset(); // Limpa o formulário após salvar
    setIsLoading(false);
  }

  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icons.Add className="mr-2 h-6 w-6" />
          Adicionar Novo Exercício
        </CardTitle>
        <CardDescription>Preencha os detalhes do exercício abaixo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Exercício</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Supino Reto" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="series"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Séries</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 3" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repetitions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetições</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 10-12" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo de Descanso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 60s" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Foco na fase excêntrica, cadência controlada..."
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Exercício
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
