'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline tracking-tight">Bem-vindo!</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Interface Simples</CardTitle>
          <CardDescription>Este é o ponto de partida do seu novo app.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Comece a construir suas funcionalidades aqui.</p>
          <Button className="mt-4">
            <Icons.Activity className="mr-2 h-4 w-4" />
            Ação Exemplo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
