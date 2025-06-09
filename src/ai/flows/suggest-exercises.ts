'use server';
/**
 * @fileOverview Um fluxo de IA para sugerir exercícios de treino.
 *
 * - suggestExercises - Uma função que sugere exercícios com base no grupo muscular e equipamento.
 * - SuggestExercisesInput - O tipo de entrada para a função suggestExercises.
 * - SuggestExercisesOutput - O tipo de retorno para a função suggestExercises.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExercisesInputSchema = z.object({
  muscleGroup: z.string().describe('O principal grupo muscular a ser focado, ex: "peito", "pernas", "costas".'),
  equipmentAvailable: z.string().optional().describe('Lista opcional de equipamentos disponíveis, ex: "halteres, banco".'),
  exerciseCount: z.number().optional().default(3).describe('Número opcional de exercícios a sugerir, padrão é 3.'),
});
export type SuggestExercisesInput = z.infer<typeof SuggestExercisesInputSchema>;

const SuggestedExerciseSchema = z.object({
  name: z.string().describe('Nome do exercício sugerido.'),
  description: z.string().describe('Breve descrição de como realizar o exercício.'),
  sets: z.string().describe('Número sugerido de séries, ex: "3-4".'),
  reps: z.string().describe('Número sugerido de repetições, ex: "8-12".'),
});

const SuggestExercisesOutputSchema = z.object({
  suggestedExercises: z.array(SuggestedExerciseSchema).describe('Uma lista de exercícios sugeridos.'),
});
export type SuggestExercisesOutput = z.infer<typeof SuggestExercisesOutputSchema>;

export async function suggestExercises(input: SuggestExercisesInput): Promise<SuggestExercisesOutput> {
  return suggestExercisesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExercisesPrompt',
  input: {schema: SuggestExercisesInputSchema},
  output: {schema: SuggestExercisesOutputSchema},
  prompt: `Você é um personal trainer experiente. Sua tarefa é sugerir {{exerciseCount}} exercícios de treino.

Considere o seguinte:
- Grupo Muscular Principal: {{{muscleGroup}}}
{{#if equipmentAvailable}}- Equipamentos Disponíveis: {{{equipmentAvailable}}}{{/if}}

Forneça o nome do exercício, uma breve descrição de como realizá-lo, o número de séries e o número de repetições para cada um.
Se nenhum equipamento for especificado, sugira exercícios que possam ser feitos com peso corporal ou equipamentos comuns de academia, se apropriado para o grupo muscular.
Adapte as sugestões com base nos equipamentos, se fornecidos.
`,
});

const suggestExercisesFlow = ai.defineFlow(
  {
    name: 'suggestExercisesFlow',
    inputSchema: SuggestExercisesInputSchema,
    outputSchema: SuggestExercisesOutputSchema,
  },
  async input => {
    // Garante que exerciseCount tenha um valor padrão se não for fornecido
    const GneratedInput = {...input, exerciseCount: input.exerciseCount ?? 3}
    const {output} = await prompt(GneratedInput);
    
    if (!output || !output.suggestedExercises) {
      // Fallback para garantir que sempre retornamos a estrutura esperada, mesmo que vazia
      return { suggestedExercises: [] };
    }
    return output;
  }
);
