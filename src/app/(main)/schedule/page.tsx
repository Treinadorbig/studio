import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline tracking-tight">Workout Schedule</h1>
      <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
        <Icons.Schedule className="h-24 w-24 text-primary mb-6" />
        <CardTitle className="text-2xl font-headline">Coming Soon!</CardTitle>
        <CardDescription className="mt-2 max-w-md">
          The workout scheduling and reminders feature is currently under development. 
          Soon you'll be able to plan workouts for your clients and send them automated reminders.
        </CardDescription>
        {/* Placeholder for a calendar or list view */}
      </Card>
    </div>
  );
}
