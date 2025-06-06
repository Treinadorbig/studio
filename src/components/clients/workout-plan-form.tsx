
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';

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
import type { Client, WorkoutPlan, WorkoutItem, Exercise as ExerciseType } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const workoutItemSchema = z.object({
  exerciseId: z.string().optional(),
  exerciseName: z.string().min(1, { message: "Nome do exercício é obrigatório." }),
  sets: z.coerce.number().min(1, { message: "Séries deve ser pelo menos 1." }),
  reps: z.string().min(1, { message: "Repetições são obrigatórias." }),
  rest: z.string().optional(),
  notes: z.string().optional(),
});

const workoutPlanFormSchema = z.object({
  id: z.string().optional(), // For editing existing plans
  clientId: z.string(),
  name: z.string().min(3, { message: 'Nome do plano deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  items: z.array(workoutItemSchema).min(1, { message: "Um plano de treino deve ter pelo menos um exercício." }),
  createdAt: z.string().optional(), // Auto-filled
});

type WorkoutPlanFormValues = z.infer<typeof workoutPlanFormSchema>;

interface WorkoutPlanFormProps {
  client: Client;
  planToEdit?: WorkoutPlan | null;
  onSubmit: (data: WorkoutPlanFormValues) => void;
  onCancel: () => void;
  availableExercises: ExerciseType[];
}

export function WorkoutPlanForm({ client, planToEdit, onSubmit, onCancel, availableExercises }: WorkoutPlanFormProps) {
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [currentItemIndexForSelector, setCurrentItemIndexForSelector] = useState<number | null>(null);

  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanFormSchema),
    defaultValues: {
      id: planToEdit?.id || undefined,
      clientId: client.id,
      name: planToEdit?.name || '',
      description: planToEdit?.description || '',
      items: planToEdit?.items || [],
      createdAt: planToEdit?.createdAt || new Date().toISOString(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    form.reset({
      id: planToEdit?.id || undefined,
      clientId: client.id,
      name: planToEdit?.name || '',
      description: planToEdit?.description || '',
      items: planToEdit?.items || [],
      createdAt: planToEdit?.createdAt || new Date().toISOString(),
    });
  }, [planToEdit, client.id, form]);


  const handleFormSubmit = (values: WorkoutPlanFormValues) => {
    onSubmit({
        ...values,
        createdAt: values.createdAt || new Date().toISOString(),
    });
  };

  const handleAddExercise = () => {
    append({ exerciseId: undefined, exerciseName: '', sets: 3, reps: '10-12', rest: '60s', notes: '' });
  };
  
  const handleSelectExerciseFromLibrary = (exercise: ExerciseType) => {
    if (currentItemIndexForSelector !== null) {
      form.setValue(`items.${currentItemIndexForSelector}.exerciseName`, exercise.name);
      form.setValue(`items.${currentItemIndexForSelector}.exerciseId`, exercise.id);
    }
    setIsExerciseSelectorOpen(false);
    setCurrentItemIndexForSelector(null);
  };

  const openExerciseSelector = (index: number) => {
    setCurrentItemIndexForSelector(index);
    setIsExerciseSelectorOpen(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Plano</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Treino A - Foco Peito" {...field} />
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
          <FormLabel>Exercícios</FormLabel>
           {form.formState.errors.items && !Array.isArray(form.formState.errors.items) && (
             <p className="text-sm font-medium text-destructive">{form.formState.errors.items.message}</p>
           )}
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-3 mb-3 border rounded-md bg-muted/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Exercício #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Icons.Delete className="h-4 w-4 mr-1" /> Remover
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name={`items.${index}.exerciseName`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>Nome do Exercício</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="Ex: Supino Reto, Agachamento Livre" {...inputField} />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" onClick={() => openExerciseSelector(index)}>
                          <Icons.Search className="mr-2 h-4 w-4" /> Biblioteca
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.sets`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Séries</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.reps`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repetições</FormLabel>
                        <FormControl>
                          <Input placeholder="8-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name={`items.${index}.rest`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de Descanso (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="60s" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name={`items.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex: focar na forma, negativas lentas" {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </ScrollArea>
          <Button type="button" variant="outline" onClick={handleAddExercise}>
            <Icons.Add className="mr-2 h-4 w-4" /> Adicionar Exercício
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>          
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Salvar Plano
          </Button>
        </div>
      </form>

      <Dialog open={isExerciseSelectorOpen} onOpenChange={setIsExerciseSelectorOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecionar Exercício da Biblioteca</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Buscar exercício..." />
            <CommandList>
              <CommandEmpty>Nenhum exercício encontrado.</CommandEmpty>
              <CommandGroup heading="Exercícios Disponíveis">
                <ScrollArea className="h-[300px]">
                  {availableExercises.map((exercise) => (
                    <CommandItem
                      key={exercise.id}
                      value={exercise.name}
                      onSelect={() => handleSelectExerciseFromLibrary(exercise)}
                      className="cursor-pointer"
                    >
                      {exercise.name}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
