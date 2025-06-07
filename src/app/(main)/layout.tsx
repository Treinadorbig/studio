
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MOCK_CLIENTS } from '@/lib/mock-data'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Client } from '@/lib/types';


const TRAINER_NAV_ITEMS = [
  { href: '/dashboard', label: 'Clientes', icon: Icons.Clients },
  { href: '/exercises', label: 'Biblioteca de Treinos', icon: Icons.Exercises },
  { href: '/schedule', label: 'Agenda Geral', icon: Icons.Schedule },
];

const CLIENT_NAV_ITEMS = [
  { href: '/dashboard', label: 'Meus Treinos', icon: Icons.Dashboard },
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
  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth); // Sign out from Firebase Auth
      localStorage.removeItem('isAuthenticated'); // Kept for immediate UI update if needed
      localStorage.removeItem('userType');
      localStorage.removeItem('loggedInClientEmail'); // May become obsolete with Firebase Auth
      router.push('/signup'); // Redirect to signup as login is removed
    } catch (error) {
      console.error("Error signing out: ", error);
      // Fallback or error handling if needed
      router.push('/signup');
    }
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
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);


  useEffect(() => {
    setIsClientSide(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        localStorage.setItem('isAuthenticated', 'true'); // For compatibility, can be phased out
        const storedUserType = localStorage.getItem('userType') as 'personal' | 'client' | null;
        setUserType(storedUserType); // Rely on localStorage for userType initially
        setUserEmail(user.email || 'usuario@exemplo.com');

        if (storedUserType === 'client') {
          // Fetch client details from Firestore using UID
          const clientDocRef = doc(db, 'clients', user.uid);
          const clientSnap = await getDoc(clientDocRef);
          if (clientSnap.exists()) {
            const clientData = clientSnap.data() as Client;
            setUserName(clientData.name);
            setUserAvatar(clientData.avatarUrl || 'https://placehold.co/100x100.png');
            setUserAvatarHint(clientData.dataAiHint || 'user avatar');
          } else {
             // Client data not found in Firestore for this UID, fallback or redirect
            setUserName('Cliente'); // Fallback name
            console.warn("Client data not found in Firestore for UID:", user.uid);
          }
        } else if (storedUserType === 'personal') {
          // For personal trainer, if they were to use Firebase Auth
          setUserName('Personal Trainer'); // Placeholder
          setUserAvatar('https://placehold.co/100x100.png');
          setUserAvatarHint('trainer avatar');
          // Personal trainer might not have an email stored directly in auth if using custom login
        } else {
          // No userType stored, or unknown type
           router.replace('/signup'); // If type is unknown, redirect
        }
      } else {
        // User is signed out
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
        localStorage.removeItem('loggedInClientEmail');
        router.replace('/signup'); // Changed from /login to /signup
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const currentNavItems = userType === 'client' ? CLIENT_NAV_ITEMS : TRAINER_NAV_ITEMS;

  if (isLoadingAuth || !isClientSide) { // Check isLoadingAuth as well
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.Logo className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // This check might be redundant if onAuthStateChanged handles redirection properly
  // but kept for safety during transition
  if (typeof window !== 'undefined' && !auth.currentUser && !localStorage.getItem('isAuthenticated')) {
     if (pathname !== '/signup' && pathname !== '/some-public-page') { // Add any other public pages
        router.replace('/signup');
        return (
           <div className="flex h-screen w-full items-center justify-center">
            <Icons.Logo className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-2">Redirecionando...</p>
          </div>
        );
     }
  }
  const pathname = usePathname();
  if (!auth.currentUser && pathname !== '/signup' ) {
     // User is not authenticated and not on a public page, show loading or redirect.
     // The onAuthStateChanged should handle redirection, this is a fallback.
     // To avoid flash of content, it's better to rely on isLoadingAuth.
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
              <SheetHeader className="border-b border-sidebar-border px-4 py-4">
                <SheetTitle className="text-lg font-semibold text-sidebar-foreground">Menu Principal</SheetTitle>
              </SheetHeader>
              <div className="flex h-14 items-center border-b border-sidebar-border px-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                  <Icons.Logo className="h-6 w-6" />
                  <span className="">BigTreino</span>
                </Link>
              </div>
              <nav className="flex-1 space-y-1 p-4 text-lg font-medium">
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
