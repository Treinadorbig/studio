
'use client';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    setIsClientMounted(true);
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
    router.push('/login');
  };

  if (!isClientMounted) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Icons.Logo className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Icons.Logo className="h-6 w-6" />
            <span className="font-bold sm:inline-block">
              BigTreino
            </span>
          </Link>
          <nav className="flex flex-1 items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            {userType === 'personal' && (
              <>
                <Link href="/training-library" className="text-muted-foreground transition-colors hover:text-foreground">
                  Biblioteca de Treinos
                </Link>
                <Link href="/diet-library" className="text-muted-foreground transition-colors hover:text-foreground">
                  Biblioteca de Dietas
                </Link>
              </>
            )}
            {/* Adicionar mais links de navegação aqui conforme necessário */}
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} BigTreino.
          </p>
        </div>
      </footer>
    </div>
  );
}
