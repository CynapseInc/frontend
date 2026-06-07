import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Button } from '../../ui/button';

interface DeleteThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  themeName: string;
}

export default function DeleteThemeDialog({ isOpen, onClose, onConfirm, themeName }: DeleteThemeDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px]" style={{ color: '#F4ACB7' }}>
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]" style={{ color: '#9D8189' }}>
            Tem certeza que deseja excluir o tema <strong style={{ color: '#6D6875' }}>"{themeName}"</strong>?
          
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
