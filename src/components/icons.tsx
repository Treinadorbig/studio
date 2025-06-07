
import {
  Dumbbell, // Usando como Logo
  Activity, // Para loading e dashboard
  Users, // Para clientes
  ClipboardList, // Para planos de treino / Biblioteca de Treinos
  CalendarDays, // Para agendamento
  Apple, // Para planos de dieta / Biblioteca de Dietas
  LogOut, // Para logout
  Settings, // Para configurações
  PlusCircle, // Para adicionar
  Edit, // Para editar
  Trash2, // Para deletar
  AlertTriangle, // Para avisos
  CheckCircle2, // Para sucesso
  Menu, // Para menu mobile
  BookOpen, // Novo ícone para biblioteca de treinos
  type LucideProps,
} from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => <Dumbbell {...props} />,
  Activity: (props: LucideProps) => <Activity {...props} />,
  Users: (props: LucideProps) => <Users {...props} />,
  WorkoutPlan: (props: LucideProps) => <ClipboardList {...props} />, // Pode ser usado para planos de cliente
  WorkoutLibrary: (props: LucideProps) => <BookOpen {...props} />, // Ícone para a biblioteca de treinos
  DietLibrary: (props: LucideProps) => <Apple {...props} />, // Ícone para a biblioteca de dietas
  Schedule: (props: LucideProps) => <CalendarDays {...props} />,
  DietPlan: (props: LucideProps) => <Apple {...props} />, // Ícone para planos de dieta (pode ser o mesmo da lib)
  Logout: (props: LucideProps) => <LogOut {...props} />,
  Settings: (props: LucideProps) => <Settings {...props} />,
  Add: (props: LucideProps) => <PlusCircle {...props} />,
  Edit: (props: LucideProps) => <Edit {...props} />,
  Delete: (props: LucideProps) => <Trash2 {...props} />,
  Warning: (props: LucideProps) => <AlertTriangle {...props} />,
  Success: (props: LucideProps) => <CheckCircle2 {...props} />,
  Menu: (props: LucideProps) => <Menu {...props} />,
};

export default Icons;
