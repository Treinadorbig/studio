
import { SignUpForm } from '@/components/auth/signup-form';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Icons.Logo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold">Criar Conta de Cliente</CardTitle>
        <CardDescription>Preencha os dados abaixo para se registrar.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Faça login aqui
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
