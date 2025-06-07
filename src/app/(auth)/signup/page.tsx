
import { SignUpForm } from '@/components/auth/signup-form';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Link import removed as it's no longer used

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Criar Conta no BigTreino</CardTitle>
          <CardDescription>Preencha os campos abaixo para se registrar</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          {/* Removed the link to the login page */}
        </CardContent>
      </Card>
    </div>
  );
}
