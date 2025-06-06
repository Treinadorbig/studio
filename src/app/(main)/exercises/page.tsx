'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MOCK_EXERCISES } from '@/lib/mock-data';
import type { Exercise } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-200 cursor-pointer animate-fade-in">
          <CardHeader>
            {exercise.videoUrl && (
               <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image src={exercise.videoUrl} alt={exercise.name} layout="fill" objectFit="cover" data-ai-hint={exercise.dataAiHint || 'exercise video'} />
              </div>
            )}
            <CardTitle className="mt-2 text-xl font-headline">{exercise.name}</CardTitle>
            <CardDescription className="text-sm h-12 overflow-hidden text-ellipsis">
              {exercise.description.substring(0, 80)}...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Muscles: {exercise.muscleGroups.slice(0,2).join(', ')}{exercise.muscleGroups.length > 2 ? '...' : ''}
              </p>
              {exercise.equipmentNeeded && (
                <p className="text-xs text-muted-foreground">
                  Equipment: {exercise.equipmentNeeded.join(', ')}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
             <Badge variant={exercise.difficulty === 'Beginner' ? 'secondary' : exercise.difficulty === 'Intermediate' ? 'outline' : 'default'}>
              {exercise.difficulty || 'N/A'}
            </Badge>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{exercise.name}</DialogTitle>
          <DialogDescription>{exercise.difficulty && <Badge variant="outline" className="mr-2">{exercise.difficulty}</Badge>} Targets: {exercise.muscleGroups.join(', ')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {exercise.videoUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image src={exercise.videoUrl} alt={exercise.name} layout="fill" objectFit="cover" data-ai-hint={exercise.dataAiHint || 'exercise video'} />
            </div>
          )}
          <p className="text-sm text-foreground whitespace-pre-line">{exercise.description}</p>
          {exercise.equipmentNeeded && exercise.equipmentNeeded.length > 0 && (
            <p className="text-sm text-muted-foreground"><strong>Equipment:</strong> {exercise.equipmentNeeded.join(', ')}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredExercises = MOCK_EXERCISES.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-headline tracking-tight">Exercise Library</h1>
        <div className="relative w-full md:w-auto">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search exercises or muscle groups..."
            className="pl-10 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredExercises.length === 0 ? (
         <Card className="flex flex-col items-center justify-center p-10 text-center">
           <Icons.Exercises className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">No Exercises Found</CardTitle>
          <CardDescription className="mt-2">
            Try adjusting your search term or add new exercises to the library.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
