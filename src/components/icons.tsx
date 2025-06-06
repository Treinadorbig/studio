
import {
  LayoutDashboard,
  Users,
  Dumbbell, // Will be used for Logo now
  CalendarDays,
  Settings,
  LogIn,
  LogOut,
  UserCircle,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  MessageSquare,
  ClipboardList,
  Brain,
  ArrowLeft,
  Activity,
  HeartPulse, 
  Apple, 
  type LucideProps,
} from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => <Dumbbell {...props} />, // Changed to Dumbbell
  Dashboard: LayoutDashboard,
  Clients: Users,
  Exercises: Dumbbell, 
  Schedule: CalendarDays,
  Settings,
  Login: LogIn,
  Logout: LogOut,
  Profile: UserCircle,
  ChevronDown,
  ChevronRight,
  Add: PlusCircle,
  Edit,
  Delete: Trash2,
  Search,
  Feedback: MessageSquare,
  WorkoutPlan: ClipboardList,
  Diet: Apple, 
  Brain,
  ArrowLeft,
  Activity,
};

export default Icons;
