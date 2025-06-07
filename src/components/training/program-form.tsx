
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

const programSchema = z.object({
  name: z.string().min(3, { message: 'Nome do programa deve ter pelo menos 3 caracteres.' }).max(100),
});

type ProgramFormValues = z.infer<typeof programSchema>;

interface ProgramFormProps {
  onSave: (programName: string) => void;
}

export function ProgramForm({ onSave }: ProgramFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: ProgramFormValues) {
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
              <FormLabel>Nome do Novo Programa de Treino</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Hipertrofia Iniciante, Foco em Pernas" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
          Criar Programa
        </Button>
      </form>
    </Form>
  );
}
