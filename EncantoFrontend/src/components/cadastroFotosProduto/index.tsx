import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {Navigate, useNavigate} from 'react-router-dom';
import './index-fotos.css'
interface ProductPhoto {
  id: string;
  url: string;
  file: File;
}

// Mock data do produto (viria da tela anterior)
const mockProduct = {
  title: 'Caneca do Ben 10',
  description: 'Caneca personalizada com estampa do Ben 10, em cerâmica de alta qualidade. Ideal para presentes e uso diário.',
  category: 'Herói',
  theme: 'Ben 10',
  item: 'Caneca',
};

export default function App() {

  const navigate = useNavigate();  
  const [photos, setPhotos] = useState<ProductPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: ProductPhoto[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const photoUrl = URL.createObjectURL(file);
        newPhotos.push({
          id: Date.now().toString() + Math.random(),
          url: photoUrl,
          file: file,
        });
      }
    });

    setPhotos([...photos, ...newPhotos]);
  };

  const handleRemovePhoto = (photoId: string) => {
    const photoToRemove = photos.find(p => p.id === photoId);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    console.log('Fotos salvas:', photos);
    alert(`${photos.length} foto(s) cadastrada(s) com sucesso! Produto finalizado.`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Navbar */}
      

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* Cabeçalho */}
        <div className="mb-10">
          <button 
            className="flex items-center gap-2 mb-4 text-[15px] transition-colors hover:opacity-80"
            style={{ color: '#9D8189' }}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Fotos do Produto</h1>
          <p className="text-[17px]" style={{ color: '#9D8189' }}>Adicione as fotos do produto para finalizar o cadastro</p>
        </div>

        {/* Resumo do Produto */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
          <h2 className="text-[22px] mb-4" style={{ color: '#F4ACB7' }}>
            <strong>Informações do Produto</strong>
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] mb-1" style={{ color: '#9D8189' }}>
                Título do Produto
              </label>
              <p className="text-[17px]" style={{ color: '#6D6875' }}>
                <strong>{mockProduct.title}</strong>
              </p>
            </div>

            <div>
              <label className="block text-[14px] mb-1" style={{ color: '#9D8189' }}>
                Item
              </label>
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                style={{
                  backgroundColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              >
                {mockProduct.item}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[14px] mb-1" style={{ color: '#9D8189' }}>
                Descrição
              </label>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                {mockProduct.description}
              </p>
            </div>

            <div>
              <label className="block text-[14px] mb-1" style={{ color: '#9D8189' }}>
                Categoria
              </label>
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full text-[14px]"
                style={{
                  backgroundColor: '#FFCAD4',
                  color: '#6D6875'
                }}
              >
                {mockProduct.category}
              </div>
            </div>

            <div>
              <label className="block text-[14px] mb-1" style={{ color: '#9D8189' }}>
                Tema
              </label>
              <p className="text-[15px]" style={{ color: '#6D6875' }}>
                {mockProduct.theme}
              </p>
            </div>
          </div>
        </div>

        {/* Galeria de Fotos */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-6" style={{ border: '1px solid #D8E2DC' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px]" style={{ color: '#F4ACB7' }}>
              <strong>Galeria de Fotos</strong>
            </h2>
            <span className="text-[15px]" style={{ color: '#9D8189' }}>
              {photos.length} {photos.length === 1 ? 'foto adicionada' : 'fotos adicionadas'}
            </span>
          </div>

          {/* Grid de fotos */}
          <div className="grid grid-cols-4 gap-6">
            
            {/* Botão Adicionar Foto */}
            <button
              onClick={handleUploadClick}
              className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:bg-opacity-50 cursor-pointer"
              style={{
                borderColor: '#D8E2DC',
                backgroundColor: '#F9F9F9',
                color: '#9D8189'
              }}
            >
              <Upload className="size-10" style={{ color: '#F4ACB7' }} />
              <span className="text-[15px]" style={{ color: '#6D6875' }}>
                Adicionar Foto
              </span>
            </button>

            {/* Fotos adicionadas */}
            {photos.map(photo => (
              <div
                key={photo.id}
                className="aspect-square rounded-lg overflow-hidden border relative group"
                style={{ borderColor: '#D8E2DC' }}
              >
                <img
                  src={photo.url}
                  alt="Foto do produto"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: '#FFCAD4',
                  }}
                  title="Remover foto"
                >
                  <X className="size-4" style={{ color: '#6D6875' }} />
                </button>
              </div>
            ))}

            {/* Cards vazios quando não há fotos */}
            {photos.length === 0 && (
              <>
                {[1, 2, 3].map(index => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg border flex items-center justify-center"
                    style={{
                      borderColor: '#D8E2DC',
                      backgroundColor: '#F9F9F9'
                    }}
                  >
                    <ImageIcon className="size-12" style={{ color: '#D8E2DC' }} />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhoto}
            className="hidden"
          />

          {/* Dica */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
            <p className="text-[14px]" style={{ color: '#9D8189' }}>
              💡 <strong style={{ color: '#6D6875' }}>Dica:</strong> Adicione fotos de diferentes ângulos para que seus clientes possam visualizar melhor o produto. Você pode adicionar várias fotos de uma vez.
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 h-12 text-[16px]"
            style={{
              backgroundColor: 'white',
              color: '#9D8189',
              border: '1px solid #D8E2DC'
            }}
          >
            Voltar
          </Button>
          <Button
            onClick={handleSave}
            disabled={photos.length === 0}
            className="px-8 py-3 h-12 text-[16px] disabled:opacity-40"
            style={{
              backgroundColor: '#F4ACB7',
              color: 'white'
            }}
          >
            Salvar e Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}
