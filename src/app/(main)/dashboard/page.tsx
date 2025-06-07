'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function DashboardPage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
    setUserEmail(localStorage.getItem('userEmail'));
  }, []);

  let welcomeMessage = 'Bem-vindo(a)!';
  if (userType === 'personal') {
    welcomeMessage = `Bem-vindo(a), Personal Trainer ${userEmail ? `(${userEmail})` : ''}!`;
  } else if (userType === 'client') {
    welcomeMessage = `Bem-vindo(a), Cliente ${userEmail ? `(${userEmail})` : ''}!`;
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{welcomeMessage}</CardTitle>
          <CardDescription>Este é o seu painel de controle.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Comece a construir suas funcionalidades aqui.</p>
          <div className="mt-6 flex items-center justify-center">
            <Icons.Activity className="h-24 w-24 text-primary/70" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
