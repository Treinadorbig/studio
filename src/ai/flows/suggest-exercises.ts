'use server';

/**
 * @fileOverview An AI agent that suggests exercises, sets, and reps based on a client's profile, goals, and workout history.
 *
 * - suggestExercises - A function that suggests exercises for a client.
 * - SuggestExercisesInput - The input type for the suggestExercises function.
 * - SuggestExercisesOutput - The return type for the suggestExercises function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExercisesInputSchema = z.object({
  clientProfile: z
    .string()
    .describe('The profile of the client, including their age, gender, weight, height, and fitness level.'),
  goals: z.string().describe('The fitness goals of the client, such as weight loss, muscle gain, or improved endurance.'),
  workoutHistory: z
    .string()
    .describe('The workout history of the client, including the exercises they have done in the past, sets, reps and the weight used.'),
});
export type SuggestExercisesInput = z.infer<typeof SuggestExercisesInputSchema>;

const SuggestExercisesOutputSchema = z.object({
  suggestedExercises: z.array(
    z.object({
      exerciseName: z.string().describe('The name of the exercise.'),
      sets: z.number().describe('The number of sets to perform.'),
      reps: z.number().describe('The number of repetitions to perform per set.'),
      weight: z.string().describe('The weight to use for the exercise.'),
      reason: z.string().describe('Why is this exercise is being suggested.'),
    })
  ).describe('A list of suggested exercises, sets, and reps based on the client profile, goals, and workout history.'),
});
export type SuggestExercisesOutput = z.infer<typeof SuggestExercisesOutputSchema>;

export async function suggestExercises(input: SuggestExercisesInput): Promise<SuggestExercisesOutput> {
  return suggestExercisesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExercisesPrompt',
  input: {schema: SuggestExercisesInputSchema},
  output: {schema: SuggestExercisesOutputSchema},
  prompt: `You are a personal trainer who specializes in creating personalized workout plans for clients.

  Based on the client's profile, goals, and workout history, suggest exercises, sets, and reps that would be effective for them.

  Client Profile: {{{clientProfile}}}
  Goals: {{{goals}}}
  Workout History: {{{workoutHistory}}}

  Suggest exercises, sets, and reps that are appropriate for the client's fitness level and goals. Provide the weight to be used for each exercise and the reason for suggestion.
  Ensure that the workout plan is safe and effective for the client. Always start with easier exercise and gradually increase the intensity as the client progresses.

  Return the output in JSON format.
  `,
});

const suggestExercisesFlow = ai.defineFlow(
  {
    name: 'suggestExercisesFlow',
    inputSchema: SuggestExercisesInputSchema,
    outputSchema: SuggestExercisesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
