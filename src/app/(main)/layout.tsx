
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
import { MOCK_CLIENTS } from '@/lib/mock-data'; // For fetching client name

const TRAINER_NAV_ITEMS = [
  { href: '/dashboard', label: 'Clientes', icon: Icons.Clients },
  { href: '/exercises', label: 'Biblioteca de Treinos', icon: Icons.Exercises },
  { href: '/schedule', label: 'Agenda Geral', icon: Icons.Schedule },
];

const CLIENT_NAV_ITEMS = [
  { href: '/dashboard', label: 'Meus Treinos', icon: Icons.Dashboard },
  // { href: '/my-workouts', label: 'Meus Treinos', icon: Icons.WorkoutPlan }, // Future page
  // { href: '/my-profile', label: 'Meu Perfil', icon: Icons.Profile }, // Future page
  { href: '/schedule', label: 'Minha Agenda', icon: Icons.Schedule },
];

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

function SidebarNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 px-4">
      {navItems.map((item) => (
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

function UserNav({ userType, userName, userEmail, avatarUrl, avatarHint }: { 
  userType: 'personal' | 'client' | null;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  avatarHint?: string;
}) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('loggedInClientEmail');
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl || "https://placehold.co/100x100.png"} alt={userName} data-ai-hint={avatarHint || "user avatar"} />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Profile and Settings could lead to different pages based on userType in the future */}
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <Icons.Profile className="mr-2 h-4 w-4" />
          <span>{userType === 'client' ? 'Meu Perfil' : 'Profile'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <Icons.Settings className="mr-2 h-4 w-4" />
          <span>{userType === 'client' ? 'Configurações' : 'Settings'}</span>
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
  const [isClientSide, setIsClientSide] = useState(false);
  const [userType, setUserType] = useState<'personal' | 'client' | null>(null);
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('usuario@exemplo.com');
  const [userAvatar, setUserAvatar] = useState('https://placehold.co/100x100.png');
  const [userAvatarHint, setUserAvatarHint] = useState('user avatar');


  useEffect(() => {
    setIsClientSide(true);
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    
    const type = localStorage.getItem('userType') as 'personal' | 'client' | null;
    setUserType(type);

    if (type === 'client') {
      const clientEmail = localStorage.getItem('loggedInClientEmail');
      if (clientEmail) {
        const clientData = MOCK_CLIENTS.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
        if (clientData) {
          setUserName(clientData.name);
          setUserEmail(clientData.email);
          setUserAvatar(clientData.avatarUrl || 'https://placehold.co/100x100.png');
          setUserAvatarHint(clientData.dataAiHint || 'user avatar');
        } else {
          setUserName('Cliente');
          setUserEmail(clientEmail);
        }
      }
    } else if (type === 'personal') {
      setUserName('Personal Trainer');
      setUserEmail('trainer@example.com'); // Placeholder
      setUserAvatar('https://placehold.co/100x100.png');
      setUserAvatarHint('trainer avatar');
    }

  }, [router]);

  const currentNavItems = userType === 'client' ? CLIENT_NAV_ITEMS : TRAINER_NAV_ITEMS;

  if (!isClientSide || !userType) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.Logo className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (typeof window !== 'undefined' && !localStorage.getItem('isAuthenticated')) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Icons.Logo className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Redirecionando para o login...</p>
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
              <span className="">BigTreino</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            <SidebarNav navItems={currentNavItems} />
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
                <Icons.Dashboard className="h-5 w-5" />
                <span className="sr-only">Alternar menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar p-0 text-sidebar-foreground">
              <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                  <Icons.Logo className="h-6 w-6" />
                  <span className="">BigTreino</span>
                </Link>
              </div>
              <nav className="grid gap-2 p-4 text-lg font-medium">
                {currentNavItems.map((item) => (
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
          <UserNav userType={userType} userName={userName} userEmail={userEmail} avatarUrl={userAvatar} avatarHint={userAvatarHint} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
