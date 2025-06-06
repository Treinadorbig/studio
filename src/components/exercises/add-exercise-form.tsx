
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import type { Exercise } from '@/lib/types';

const addExerciseFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome do exercício deve ter pelo menos 2 caracteres.' }),
  description: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres.' }),
  muscleGroups: z.string().min(3, { message: 'Informe ao menos um grupo muscular.' }), // Comma-separated
  equipmentNeeded: z.string().optional(), // Comma-separated
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced'], { required_error: 'Selecione a dificuldade.'}),
  videoUrl: z.string().url({ message: 'Por favor, insira uma URL válida para o vídeo.' }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

type AddExerciseFormValues = Omit<Exercise, 'id'>;

interface AddExerciseFormProps {
  onSubmit: (data: AddExerciseFormValues) => void;
  onCancel: () => void;
}

export function AddExerciseForm({ onSubmit, onCancel }: AddExerciseFormProps) {
  const form = useForm<z.infer<typeof addExerciseFormSchema>>({
    resolver: zodResolver(addExerciseFormSchema),
    defaultValues: {
      name: '',
      description: '',
      muscleGroups: '',
      equipmentNeeded: '',
      difficulty: 'Intermediate',
      videoUrl: '',
      dataAiHint: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof addExerciseFormSchema>) => {
    const muscleGroupsArray = values.muscleGroups.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const equipmentNeededArray = values.equipmentNeeded?.split(',').map(s => s.trim()).filter(s => s.length > 0) || [];
    
    onSubmit({
      ...values,
      muscleGroups: muscleGroupsArray,
      equipmentNeeded: equipmentNeededArray,
    });
    form.reset(); 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Exercício</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Supino Reto" {...field} />
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva como realizar o exercício, postura, etc." {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="muscleGroups"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupos Musculares (separados por vírgula)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Peitoral, Tríceps, Deltoide Anterior" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="equipmentNeeded"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipamento Necessário (opcional, separado por vírgula)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Barra, Halteres, Banco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dificuldade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a dificuldade" />
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
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Vídeo (opcional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://youtube.com/seu-video" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dica para IA (opcional, para busca de imagem)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: supino barra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Adicionar Exercício
          </Button>
        </div>
      </form>
    </Form>
  );
}
