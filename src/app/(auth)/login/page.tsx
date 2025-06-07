import { LoginForm } from '@/components/auth/login-form';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Icons.Logo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold">Login</CardTitle>
        <CardDescription>Acesse sua conta para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        {/* No link para signup por enquanto, pode ser adicionado depois se necessário */}
        {/* 
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Crie aqui
          </Link>
        </p>
        */}
      </CardContent>
    </Card>
  );
}
