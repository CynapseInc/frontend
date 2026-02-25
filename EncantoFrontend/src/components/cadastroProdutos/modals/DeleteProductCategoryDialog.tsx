import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Button } from '../../ui/button';

interface DeleteProductCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

export default function DeleteProductCategoryDialog({ isOpen, onClose, onConfirm, categoryName }: DeleteProductCategoryDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px]" style={{ color: '#F4ACB7' }}>
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]" style={{ color: '#9D8189' }}>
            Tem certeza que deseja excluir a categoria <strong style={{ color: '#6D6875' }}>"{categoryName}"</strong>?
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
