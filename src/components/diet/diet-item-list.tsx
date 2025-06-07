
'use client';

import type { DietItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DietItemListProps {
  items: DietItem[];
  onDelete: (itemId: string) => void;
}

export function DietItemList({ items, onDelete }: DietItemListProps) {
  if (items.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="shadow-sm rounded-md overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-4 bg-muted/30">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{item.foodName}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Icons.Delete className="h-4 w-4" />
                    <span className="sr-only">Remover {item.foodName}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover o item "{item.foodName}" da dieta? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-3 text-sm space-y-1">
            <div>
              <p className="font-medium text-muted-foreground">Quantidade</p>
              <p>{item.quantity}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
