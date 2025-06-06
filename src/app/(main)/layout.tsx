'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { href: '/exercises', label: 'Exercises', icon: Icons.Exercises },
  { href: '/schedule', label: 'Schedule', icon: Icons.Schedule },
  // { href: '/settings', label: 'Settings', icon: Icons.Settings },
];

function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 px-4">
      {NAV_ITEMS.map((item) => (
        <Link key={item.label} href={item.href} legacyBehavior passHref>
          <a
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </a>
        </Link>
      ))}
    </nav>
  );
}

function UserNav() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
            <AvatarFallback>UA</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Trainer Name</p>
            <p className="text-xs leading-none text-muted-foreground">
              trainer@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}> {/* Placeholder for profile page */}
          <Icons.Profile className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard')}> {/* Placeholder for settings page */}
          <Icons.Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <Icons.Logout className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures localStorage is accessed only on client
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  if (!isClient) {
     // Render nothing or a loading indicator until client-side check completes
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.Logo className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If still not authenticated after client check (e.g. router.replace hasn't completed)
  if (typeof window !== 'undefined' && !localStorage.getItem('isAuthenticated')) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Icons.Logo className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
              <Icons.Logo className="h-6 w-6" />
              <span className="">Workout Architect</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            <SidebarNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Icons.Dashboard className="h-5 w-5" /> {/* Using Dashboard as generic menu icon */}
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar p-0 text-sidebar-foreground">
              <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                  <Icons.Logo className="h-6 w-6" />
                  <span className="">Workout Architect</span>
                </Link>
              </div>
              <nav className="grid gap-2 p-4 text-lg font-medium">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Optional: Add a global search bar here */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
