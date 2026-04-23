import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, ArrowLeft, Check, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fotoProdutoService } from '../../services/FotoProdutoService';
import { produtoService } from '../../services/ProdutoService';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import FeedbackModal from '../ui/FeedbackModal';
import ConfirmModal from '../ui/ConfirmModal'; // <-- IMPORT DO CONFIRM MODAL
import './index-fotos.css';

export default function CadastroFotosProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // <-- ESTADO PARA CONTROLAR O MODAL DE EXCLUSÃO
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; fotoId: number | null }>({
    isOpen: false,
    fotoId: null
  });

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ isOpen: true, message, type });
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. CARREGAR AS FOTOS QUE JÁ EXISTEM NO BANCO
  useEffect(() => {
    const fetchExistingPhotos = async () => {
      if (!id) return;
      try {
        const produto = await produtoService.buscarPorId(id);
        if (produto.fotos) {
          setExistingPhotos(produto.fotos);
        }
      } catch (error) {
        console.error("Erro ao carregar fotos do produto:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExistingPhotos();
  }, [id]);

  // 2. FUNÇÃO ATUALIZADA: AGORA É CHAMADA PELO MODAL DE CONFIRMAÇÃO
  const confirmDeleteExistingPhoto = async () => {
    const fotoId = deleteModal.fotoId;
    if (!id || fotoId === null) return;
    
    try {
      await fotoProdutoService.deletarFoto(id, fotoId);
      
      setExistingPhotos(prev => prev.filter(f => String(f.id) !== String(fotoId)));
      showFeedback('Foto excluída com sucesso!', 'success');
      
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
      showFeedback('Erro ao excluir foto. Verifique o console.', 'error');
    } finally {
      // Fecha o modal após o sucesso ou erro
      setDeleteModal({ isOpen: false, fotoId: null });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      navigate('/lista-produtos'); 
      return;
    }
    
    if (!id) return;

    setIsUploading(true);
    try {
      for (const file of selectedFiles) {
        await fotoProdutoService.uploadFoto(id, file);
      }
      showFeedback("Novas fotos adicionadas com sucesso!", "success");
      navigate('/lista-produtos');
    } catch (error) {
      console.error("Erro no upload:", error);
      showFeedback("Erro ao enviar as fotos. Verifique o console.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFCAD4] border-t-[#F4ACB7] rounded-full animate-spin mb-4"></div>
        <p className="text-[#9D8189]">Carregando galeria do produto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="mb-10">
          <button 
            onClick={() => navigate('/lista-produtos')}
            className="flex items-center gap-2 mb-4 text-[#9D8189] hover:text-[#F4ACB7] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar para Produtos
          </button>
          <h1 className="text-[48px] text-[#F4ACB7] mb-2">Gerenciar Fotos</h1>
          <p className="text-[#9D8189] text-[17px]">
            Adicione ou remova imagens do seu produto
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D8E2DC]">
          
          {/* FOTOS JÁ EXISTENTES NO BANCO */}
          {existingPhotos.length > 0 && (
            <div className="mb-10 pb-10 border-b border-[#D8E2DC]">
              <h3 className="text-[#6D6875] text-[18px] mb-4"><strong>Fotos Atuais ({existingPhotos.length})</strong></h3>
              <div className="grid grid-cols-4 gap-6">
                {existingPhotos.map((foto) => (
                  <div key={foto.id} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#D8E2DC] group">
                    <ImageWithFallback src={foto.foto} alt="Foto do produto" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        // <-- AQUI MUDAMOS PARA ABRIR O MODAL EM VEZ DE EXCLUIR DIRETO
                        onClick={() => setDeleteModal({ isOpen: true, fotoId: foto.id })}
                        className="bg-white p-3 rounded-full text-red-500 hover:scale-110 transition-transform shadow-lg"
                        title="Excluir Foto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ... [O RESTO DO CONTEÚDO CONTINUA IGUAL (ÁREA DE NOVAS FOTOS, ETC)] ... */}
          
          {/* ÁREA DE NOVAS FOTOS */}
          <h3 className="text-[#6D6875] text-[18px] mb-4"><strong>Adicionar Novas Fotos</strong></h3>
          <div 
            className="border-2 border-dashed border-[#D8E2DC] rounded-2xl p-12 text-center hover:bg-[#F9F9F9] transition-colors cursor-pointer mb-8 bg-[#F9F9F9]"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-[#FFE5D9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#F4ACB7]" />
            </div>
            <h3 className="text-[#6D6875] text-[18px] mb-2">Clique para selecionar novas imagens</h3>
            <p className="text-[#9D8189] text-[14px]">Formatos suportados: JPG, PNG, WEBP</p>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>

          {/* PREVIEWS DAS FOTOS QUE VÃO SUBIR */}
          {previewUrls.length > 0 && (
            <div className="mb-8 p-6 bg-[#FFE5D9]/30 rounded-xl border border-[#FFCAD4]">
              <h3 className="text-[#6D6875] text-[16px] mb-4"><strong>Prontas para Envio ({previewUrls.length})</strong></h3>
              <div className="grid grid-cols-5 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#F4ACB7] group shadow-sm">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => removeNewFile(index)}
                        className="bg-white p-1.5 rounded-full text-red-500 shadow-md hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTÕES DE AÇÃO */}
          <div className="flex justify-end gap-4 border-t border-[#D8E2DC] pt-8">
            <button 
              onClick={() => navigate('/lista-produtos')}
              className="px-8 py-3 rounded-xl text-[#9D8189] border border-[#D8E2DC] hover:bg-[#F9F9F9] transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="px-8 py-3 rounded-xl bg-[#F4ACB7] text-white flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium shadow-md"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check className="w-5 h-5" />
              )}
              {isUploading ? 'Enviando...' : selectedFiles.length === 0 ? 'Nenhuma foto nova' : 'Salvar Novas Fotos'}
            </button>
          </div>
        </div>
      </div>
      
      {/* MODAIS AQUI NO FINAL */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        message={feedback.message}
        type={feedback.type}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, fotoId: null })}
        onConfirm={confirmDeleteExistingPhoto}
        title="Excluir Foto"
        message="Tem certeza que deseja excluir esta foto permanentemente? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}