
import {
  LayoutDashboard,
  Users,
  Dumbbell,
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
  HeartPulse, // Added for new logo
  Apple, // Added for Diet Plans
  type LucideProps,
} from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => <HeartPulse {...props} />, // Changed to HeartPulse
  Dashboard: LayoutDashboard,
  Clients: Users,
  Exercises: Dumbbell, // Keeping Dumbbell for exercises context
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
  Diet: Apple, // Added Diet Icon
  Brain,
  ArrowLeft,
  Activity,
};

export default Icons;
