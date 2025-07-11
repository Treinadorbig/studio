
import {
  Dumbbell, // Usando como Logo
  Activity, // Para loading e dashboard
  Users, // Para clientes
  ClipboardList, // Para planos de treino / Biblioteca de Treinos
  CalendarDays, // Para agendamento
  LogOut, // Para logout
  Settings, // Para configurações
  PlusCircle, // Para adicionar
  Edit, // Para editar
  Trash2, // Para deletar
  AlertTriangle, // Para avisos
  CheckCircle2, // Para sucesso
  Menu, // Para menu mobile
  BookOpen, // Novo ícone para biblioteca de treinos
  Check, // Adicionado para o botão "Finalizar Treino"
  type LucideProps,
} from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => <Dumbbell {...props} />,
  Activity: (props: LucideProps) => <Activity {...props} />,
  Users: (props: LucideProps) => <Users {...props} />,
  WorkoutPlan: (props: LucideProps) => <ClipboardList {...props} />, // Pode ser usado para planos de cliente
  WorkoutLibrary: (props: LucideProps) => <BookOpen {...props} />, // Ícone para a biblioteca de treinos
  Schedule: (props: LucideProps) => <CalendarDays {...props} />,
  DietPlan: (props: LucideProps) => <ClipboardList {...props} />, // Reutilizando um ícone existente, ajuste se necessário
  Logout: (props: LucideProps) => <LogOut {...props} />,
  Settings: (props: LucideProps) => <Settings {...props} />,
  Add: (props: LucideProps) => <PlusCircle {...props} />,
  Edit: (props: LucideProps) => <Edit {...props} />,
  Delete: (props: LucideProps) => <Trash2 {...props} />,
  Warning: (props: LucideProps) => <AlertTriangle {...props} />,
  Success: (props: LucideProps) => <CheckCircle2 {...props} />,
  Menu: (props: LucideProps) => <Menu {...props} />,
  Check: (props: LucideProps) => <Check {...props} />, // Definição para Icons.Check
};

export default Icons;
