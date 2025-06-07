'use client';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Icons.Logo className="h-6 w-6" />
            <span className="font-bold sm:inline-block">
              Meu App Simples
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {/* Add simple navigation links here if needed */}
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Meu App Simples.
          </p>
        </div>
      </footer>
    </div>
  );
}
