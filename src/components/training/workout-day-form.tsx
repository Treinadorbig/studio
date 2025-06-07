
'use client';

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
import { Icons } from '@/components/icons';
import { useState } from 'react';

const workoutDaySchema = z.object({
  name: z.string().min(1, { message: 'Nome do dia de treino é obrigatório.' }).max(100),
});

type WorkoutDayFormValues = z.infer<typeof workoutDaySchema>;

interface WorkoutDayFormProps {
  onSave: (dayName: string) => void;
}

export function WorkoutDayForm({ onSave }: WorkoutDayFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<WorkoutDayFormValues>({
    resolver: zodResolver(workoutDaySchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: WorkoutDayFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula delay
    onSave(values.name);
    form.reset();
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Dia de Treino</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Treino A, Peito e Ombros, Dia de Pernas" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
          Adicionar Dia de Treino
        </Button>
      </form>
    </Form>
  );
}
