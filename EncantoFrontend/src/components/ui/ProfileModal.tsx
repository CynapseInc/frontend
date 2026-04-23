import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Upload, CheckCircle2, Pencil, User as UserIcon, Mail, IdCard, Calendar, Briefcase, Settings } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { funcionarioService } from '../../services/FuncionarioService';
import FeedbackModal from '../ui/FeedbackModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdate: (updatedUser: any) => void;
  initialMode?: 'view' | 'edit' | 'settings';
}

const API_BASE_URL = 'http://localhost:8080';

const getFotoUrl = (caminho?: string) => {
  if (!caminho) return undefined;
  if (caminho.startsWith('data:image') || caminho.startsWith('http')) return caminho;
  return `${API_BASE_URL}${caminho}`;
};

export default function ProfileModal({ isOpen, onClose, user, onUserUpdate, initialMode = 'view' }: ProfileModalProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'settings'>(initialMode);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | undefined>(user?.foto);
  
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setPreviewFoto(user?.foto);
      setSelectedFile(null);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  }, [isOpen, user, initialMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewFoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasChanges = false;
    let updatedUser = { ...user };

    try {
      if (selectedFile) {
        const usuarioAtualizado = await funcionarioService.uploadFoto(user.id, selectedFile);
        updatedUser.foto = usuarioAtualizado.foto;
        hasChanges = true;
      }

      if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          setPasswordError('Preencha todos os campos de senha.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setPasswordError('A nova senha e a confirmação não coincidem.');
          return;
        }
        await funcionarioService.mudarSenha(user.id, oldPassword, newPassword);
        hasChanges = true;
      }

      if (hasChanges) {
        setFeedback({ isOpen: true, message: 'Perfil atualizado com sucesso!', type: 'success' });
        onUserUpdate(updatedUser);
        setMode('view');
      } else {
        setMode('view');
      }
    } catch (error: any) {
      const msgErro = error.response?.status === 401 ? 'Senha atual incorreta' : 'Erro ao atualizar perfil.';
      setFeedback({ isOpen: true, message: msgErro, type: 'error' });
    }
  };

  const renderView = () => (
    <div className="px-6 py-6">
      <div className="flex flex-col items-center mb-8">
        <div className="size-28 rounded-full overflow-hidden border-2 flex items-center justify-center mb-4" style={{ backgroundColor: '#FFE5D9', borderColor: '#F4ACB7' }}>
          {user?.foto ? (
            <ImageWithFallback src={getFotoUrl(user.foto)} alt="Perfil" className="size-full object-cover" />
          ) : (
            <span className="text-[32px] font-bold" style={{ color: '#F4ACB7' }}>{user?.nome?.charAt(0) || 'U'}</span>
          )}
        </div>
        <h3 className="text-[20px] font-bold" style={{ color: '#6D6875' }}>{user?.nome}</h3>
        <p className="text-[14px]" style={{ color: '#9D8189' }}>Visão Geral da Conta</p>
      </div>

      <div className="space-y-4">
        {/* Bloco 1: E-mail */}
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
          <Mail className="size-5" style={{ color: '#F4ACB7' }} />
          <div>
            <p className="text-[12px] uppercase font-bold" style={{ color: '#9D8189' }}>E-mail corporativo</p>
            <p className="text-[14px]" style={{ color: '#6D6875' }}>{user?.email}</p>
          </div>
        </div>
        
        {/* Bloco 2: Cargo */}
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
          <Briefcase className="size-5" style={{ color: '#F4ACB7' }} />
          <div>
            <p className="text-[12px] uppercase font-bold" style={{ color: '#9D8189' }}>Cargo / Departamento</p>
            <p className="text-[14px]" style={{ color: '#6D6875' }}>{user?.cargo || 'Não definido'}</p>
          </div>
        </div>

        {/* Bloco 3: Status (Preenchimento Estético/Informativo) */}
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
          <CheckCircle2 className="size-5" style={{ color: '#F4ACB7' }} />
          <div>
            <p className="text-[12px] uppercase font-bold" style={{ color: '#9D8189' }}>Status de Acesso</p>
            <p className="text-[14px] font-medium text-emerald-600">Ativo e Autenticado</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => setMode('edit')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold transition-all hover:scale-105"
          style={{ backgroundColor: '#F4ACB7' }}
        >
          <Pencil className="size-4" /> Editar Perfil
        </button>
      </div>
    </div>
  );

  const renderEdit = () => (
    <form onSubmit={handleSubmitEdit} className="px-6 py-6">
      <div className="flex flex-col items-center mb-8">
        <label htmlFor="profile-upload" className="cursor-pointer group relative">
          <div className="size-28 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center group-hover:border-[#F4ACB7]" style={{ backgroundColor: '#FFE5D9', borderColor: '#D8E2DC' }}>
            {previewFoto ? (
              <ImageWithFallback src={getFotoUrl(previewFoto)} alt="Preview" className="size-full object-cover" />
            ) : (
              <Upload className="size-8" style={{ color: '#F4ACB7' }} />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Upload className="size-6 text-white" />
            </div>
          </div>
        </label>
        <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        <p className="mt-2 text-[13px]" style={{ color: '#9D8189' }}>Clique para alterar a foto</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-[15px] font-bold" style={{ color: '#6D6875' }}>Alterar Senha</h4>
        <input
          type="password"
          placeholder="Senha atual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-md border"
          style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2.5 rounded-md border"
            style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-2.5 rounded-md border"
            style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}
          />
        </div>
        {passwordError && <p className="text-[12px] text-red-400">{passwordError}</p>}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button type="button" onClick={() => setMode('view')} className="px-6 py-2 rounded-lg border" style={{ borderColor: '#D8E2DC', color: '#9D8189' }}>Cancelar</button>
        <button type="submit" className="px-6 py-2 rounded-lg text-white font-bold" style={{ backgroundColor: '#F4ACB7' }}>Salvar</button>
      </div>
    </form>
  );

  const renderSettings = () => (
    <div className="px-6 py-12 flex flex-col items-center text-center">
      <Settings className="size-16 mb-4 animate-spin-slow" style={{ color: '#F4ACB7' }} />
      <h3 className="text-[20px] font-bold mb-2" style={{ color: '#6D6875' }}>Configurações</h3>
      <p style={{ color: '#9D8189' }}>Esta funcionalidade está sendo preparada para você. Em breve você poderá gerenciar preferências do sistema aqui!</p>
      <button onClick={() => setMode('view')} className="mt-8 px-6 py-2 rounded-lg border" style={{ borderColor: '#D8E2DC', color: '#9D8189' }}>Voltar ao perfil</button>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[450px] p-0 overflow-hidden" style={{ backgroundColor: 'white' }}>
          <DialogTitle className="sr-only">Perfil do Usuário</DialogTitle>
          <DialogDescription className="sr-only">Informações e edição de perfil</DialogDescription>
          
          <div className="px-6 py-5 border-b flex items-center gap-2" style={{ borderColor: '#D8E2DC', backgroundColor: '#F9F9F9' }}>
            <UserIcon className="size-5" style={{ color: '#F4ACB7' }} />
            <h2 className="text-[18px] font-bold" style={{ color: '#6D6875' }}>
              {mode === 'view' ? 'Informações do Perfil' : mode === 'edit' ? 'Editar Perfil' : 'Configurações'}
            </h2>
          </div>

          {mode === 'view' ? renderView() : mode === 'edit' ? renderEdit() : renderSettings()}
        </DialogContent>
      </Dialog>
      <FeedbackModal isOpen={feedback.isOpen} onClose={() => setFeedback({ ...feedback, isOpen: false })} message={feedback.message} type={feedback.type} />
    </>
  );
}