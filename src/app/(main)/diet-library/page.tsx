
'use client';

import type { DietItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { DietItemForm } from '@/components/diet/diet-item-form';
import { DietItemList } from '@/components/diet/diet-item-list';

const LOCAL_STORAGE_DIET_ITEMS_KEY = 'dietLibraryItems';

export default function DietLibraryPage() {
  const [dietItems, setDietItems] = useState<DietItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedDietItems = localStorage.getItem(LOCAL_STORAGE_DIET_ITEMS_KEY);
      if (storedDietItems) {
        setDietItems(JSON.parse(storedDietItems));
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_DIET_ITEMS_KEY, JSON.stringify(dietItems));
    }
  }, [dietItems, isClient]);

  const handleAddDietItem = (item: Omit<DietItem, 'id'>) => {
    const newDietItem: DietItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
    };
    setDietItems((prevItems) => [...prevItems, newDietItem]);
    toast({
      title: 'Item de Dieta Adicionado!',
      description: `"${newDietItem.foodName}" foi salvo na biblioteca de dietas.`,
    });
  };

  const handleDeleteDietItem = (itemId: string) => {
    const itemToDelete = dietItems.find(item => item.id === itemId);
    setDietItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    if (itemToDelete) {
      toast({
        title: 'Item de Dieta Removido!',
        description: `"${itemToDelete.foodName}" foi removido da biblioteca.`,
        variant: 'destructive',
      });
    }
  };
  
  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold flex items-center">
              <Icons.DietLibrary className="mr-2 h-8 w-8 text-primary" />
              Carregando Biblioteca de Dietas...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aguarde um momento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Icons.DietLibrary className="mr-3 h-8 w-8 text-primary" />
          Biblioteca de Dietas
        </h1>
        <p className="text-muted-foreground">
          Adicione e gerencie os alimentos e suas quantidades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <DietItemForm onSave={handleAddDietItem} />
        </div>
        <div className="md:col-span-2">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>Itens Salvos na Biblioteca de Dietas</CardTitle>
              <CardDescription>
                {dietItems.length > 0
                  ? `Você tem ${dietItems.length} item(ns) salvo(s).`
                  : 'Nenhum item cadastrado ainda.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dietItems.length > 0 ? (
                <DietItemList items={dietItems} onDelete={handleDeleteDietItem} />
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-md">
                  <Icons.DietLibrary className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Sua biblioteca de dietas está vazia. Adicione o primeiro item no formulário ao lado!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
