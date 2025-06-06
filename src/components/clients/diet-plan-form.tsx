
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { Icons } from '@/components/icons';
import type { Client, DietPlan, DietMeal, FoodItem } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const foodItemSchema = z.object({
  foodName: z.string().min(1, { message: "Nome do alimento é obrigatório." }),
  quantity: z.string().min(1, { message: "Quantidade é obrigatória." }),
  notes: z.string().optional(),
});

const dietMealSchema = z.object({
  mealName: z.string().min(1, { message: "Nome da refeição é obrigatório." }),
  time: z.string().optional(),
  items: z.array(foodItemSchema).min(1, { message: "Adicione pelo menos um alimento à refeição." }),
});

const dietPlanFormSchema = z.object({
  id: z.string().optional(),
  clientId: z.string(),
  name: z.string().min(3, { message: 'Nome do plano deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  meals: z.array(dietMealSchema).min(1, { message: "Plano alimentar deve ter pelo menos uma refeição." }),
  createdAt: z.string().optional(),
});

type DietPlanFormValues = z.infer<typeof dietPlanFormSchema>;

interface DietPlanFormProps {
  client: Client;
  planToEdit?: DietPlan | null;
  onSubmit: (data: DietPlanFormValues) => void;
  onCancel: () => void;
}

export function DietPlanForm({ client, planToEdit, onSubmit, onCancel }: DietPlanFormProps) {
  const form = useForm<DietPlanFormValues>({
    resolver: zodResolver(dietPlanFormSchema),
    defaultValues: {
      id: planToEdit?.id || undefined,
      clientId: client.id,
      name: planToEdit?.name || '',
      description: planToEdit?.description || '',
      meals: planToEdit?.meals || [],
      createdAt: planToEdit?.createdAt || new Date().toISOString(),
    },
  });

  const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({
    control: form.control,
    name: "meals",
  });

  useEffect(() => {
    form.reset({
      id: planToEdit?.id || undefined,
      clientId: client.id,
      name: planToEdit?.name || '',
      description: planToEdit?.description || '',
      meals: planToEdit?.meals || [],
      createdAt: planToEdit?.createdAt || new Date().toISOString(),
    });
  }, [planToEdit, client.id, form]);

  const handleFormSubmit = (values: DietPlanFormValues) => {
    onSubmit({
        ...values,
        createdAt: values.createdAt || new Date().toISOString(),
    });
  };

  const handleAddMeal = () => {
    appendMeal({ mealName: '', time: '', items: [{ foodName: '', quantity: '', notes: '' }] });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Plano Alimentar</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Plano de Cutting - Semana 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Breve descrição do foco ou objetivos do plano." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Refeições</FormLabel>
          {form.formState.errors.meals && !Array.isArray(form.formState.errors.meals) && (
             <p className="text-sm font-medium text-destructive">{form.formState.errors.meals.message}</p>
           )}
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {mealFields.map((mealField, mealIndex) => (
              <Card key={mealField.id} className="p-4 mb-4 border rounded-md bg-muted/30 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">Refeição #{mealIndex + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMeal(mealIndex)}>
                    <Icons.Delete className="h-4 w-4 mr-1" /> Remover Refeição
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name={`meals.${mealIndex}.mealName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Refeição</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Café da Manhã" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`meals.${mealIndex}.time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 08:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FoodItemsArray control={form.control} mealIndex={mealIndex} />
                {form.formState.errors.meals?.[mealIndex]?.items && !Array.isArray(form.formState.errors.meals?.[mealIndex]?.items) && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.meals?.[mealIndex]?.items?.message}</p>
                )}
              </Card>
            ))}
          </ScrollArea>
          <Button type="button" variant="outline" onClick={handleAddMeal}>
            <Icons.Add className="mr-2 h-4 w-4" /> Adicionar Refeição
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Plano Alimentar
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Sub-component for managing food items within a meal
function FoodItemsArray({ control, mealIndex }: { control: any; mealIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `meals.${mealIndex}.items`,
  });

  return (
    <div className="space-y-3 pl-4 border-l-2 border-primary/50 py-2">
      <FormLabel className="text-md">Alimentos da Refeição</FormLabel>
      {fields.map((foodItemField, foodItemIndex) => (
        <div key={foodItemField.id} className="p-3 border rounded-md bg-background space-y-2 relative">
          <div className="flex justify-between items-center">
             <h5 className="font-medium text-sm">Alimento #{foodItemIndex + 1}</h5>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => remove(foodItemIndex)}
            >
              <Icons.Delete className="h-3 w-3" />
            </Button>
          </div>
          <FormField
            control={control}
            name={`meals.${mealIndex}.items.${foodItemIndex}.foodName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Nome do Alimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Ovo Cozido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`meals.${mealIndex}.items.${foodItemIndex}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Quantidade</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2 unidades, 100g" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name={`meals.${mealIndex}.items.${foodItemIndex}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Observações (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: sem sal, bem passado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ foodName: '', quantity: '', notes: '' })}>
        <Icons.Add className="mr-2 h-4 w-4" /> Adicionar Alimento
      </Button>
    </div>
  );
}
