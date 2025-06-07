
'use client';

import type { DietItem } from '@/lib/types';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useState } from 'react';

const dietItemSchema = z.object({
  foodName: z.string().min(2, { message: 'Nome do alimento deve ter pelo menos 2 caracteres.' }).max(100),
  quantity: z.string().min(1, { message: 'Quantidade é obrigatória.' }).max(50),
});

type DietItemFormValues = z.infer<typeof dietItemSchema>;

interface DietItemFormProps {
  onSave: (item: Omit<DietItem, 'id'>) => void;
}

export function DietItemForm({ onSave }: DietItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<DietItemFormValues>({
    resolver: zodResolver(dietItemSchema),
    defaultValues: {
      foodName: '',
      quantity: '',
    },
  });

  async function onSubmit(values: DietItemFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
    onSave(values);
    form.reset(); 
    setIsLoading(false);
  }

  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icons.Add className="mr-2 h-6 w-6" />
          Adicionar Item à Dieta
        </CardTitle>
        <CardDescription>Preencha os detalhes do alimento abaixo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="foodName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Alimento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Peito de Frango Grelhado" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 150g, 1 unidade, 3 colheres de sopa" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Item na Dieta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
