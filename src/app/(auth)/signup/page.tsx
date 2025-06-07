// Esta página de signup foi removida/substituída como parte do reset.
// Pode ser recriada com funcionalidade de autenticação real se necessário.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUpPagePlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>Funcionalidade de cadastro em breve.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Estamos preparando uma nova experiência!</p>
        </CardContent>
      </Card>
    </div>
  );
}
