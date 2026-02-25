import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Button } from '../../ui/button';

interface DeleteItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteItemDialog({ isOpen, onClose, onConfirm, itemName }: DeleteItemDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px]" style={{ color: '#F4ACB7' }}>
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]" style={{ color: '#9D8189' }}>
            Tem certeza que deseja excluir o item <strong style={{ color: '#6D6875' }}>"{itemName}"</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={onClose}
            className="px-6 py-2 h-11 text-[15px]"
            style={{
              backgroundColor: 'white',
              color: '#9D8189',
              border: '1px solid #D8E2DC'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="px-6 py-2 h-11 text-[15px]"
            style={{
              backgroundColor: '#FFCAD4',
              color: '#6D6875'
            }}
          >
            Excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
