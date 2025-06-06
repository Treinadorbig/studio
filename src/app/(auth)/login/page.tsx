import { LoginForm } from '@/components/auth/login-form';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Workout Architect</CardTitle>
          <CardDescription>Sign in to manage your clients and workouts</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
