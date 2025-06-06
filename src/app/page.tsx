'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // For now, we'll always redirect to login.
    // In a real app, you'd check auth status here.
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <Icons.Logo className="h-16 w-16 text-primary animate-pulse" />
      <p className="mt-4 text-lg text-foreground">Loading Workout Architect...</p>
    </div>
  );
}
