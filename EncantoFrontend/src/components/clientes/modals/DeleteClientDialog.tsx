import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '../../ui/alert-dialog';

interface DeleteClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
}

export default function DeleteClientDialog({ isOpen, onClose, onConfirm, clientName }: DeleteClientDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="max-w-md p-0"
        style={{ backgroundColor: 'white', border: '1px solid #D8E2DC' }}
      >
        <div className="p-8">
          <AlertDialogTitle className="text-[24px] mb-3" style={{ color: '#6D6875' }}>
            Deseja realmente excluir este cliente?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] mb-6" style={{ color: '#9D8189' }}>
            O cliente <span style={{ color: '#F4ACB7' }}>{clientName}</span> será inativado no sistema e não aparecerá mais na listagem.
          </AlertDialogDescription>

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel asChild>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-md text-[15px] border transition-all hover:bg-gray-50"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#9D8189'
                }}
              >
                Cancelar
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={onConfirm}
                className="px-6 py-2.5 rounded-md text-[15px] text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#F4ACB7' }}
              >
                Sim, excluir
              </button>
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
