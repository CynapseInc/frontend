import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '../ui/button'
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  theme: string;
  item: string;
  unitPrice: number;
  unitWeight: number;
  productionDays: number;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitWeight: number;
  totalWeight: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProducts: SelectedProduct[];
  onAddProduct: (product: Product) => void;
}

export default function AddProductModal({ isOpen, onClose, products, selectedProducts, onAddProduct }: AddProductModalProps) {
  const [searchProduct, setSearchProduct] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(product => {
    const search = searchProduct.toLowerCase();
    return (
      product.title.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.theme.toLowerCase().includes(search) ||
      product.item.toLowerCase().includes(search)
    );
  });

  const handleClose = () => {
    setSearchProduct('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-[1000px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: '#D8E2DC' }}
        >
          <div>
            <h2 className="text-[24px]" style={{ color: '#F4ACB7' }}>
              <strong>Adicionar Produto ao Pedido</strong>
            </h2>
            <p className="text-[14px] mt-1" style={{ color: '#9D8189' }}>
              Selecione um produto para adicionar ao pedido
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="size-6" style={{ color: '#9D8189' }} />
          </button>
        </div>

        <div className="p-6">
          
          <div className="mb-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5" style={{ color: '#9D8189' }} />
              <input
                type="text"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                placeholder="Pesquisar produto por nome, categoria, tema ou item..."
                className="w-full h-12 pl-12 pr-4 rounded-md text-[15px] border transition-all focus:outline-none focus:border-[#F4ACB7]"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredProducts.map(product => {
              const isAlreadySelected = selectedProducts.some(sp => sp.product.id === product.id);
              
              return (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden transition-all hover:shadow-lg"
                  style={{ 
                    borderColor: '#D8E2DC',
                    opacity: isAlreadySelected ? 0.5 : 1
                  }}
                >
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[16px] mb-1" style={{ color: '#6D6875' }}>
                      <strong>{product.title}</strong>
                    </h3>
                    <p className="text-[13px] mb-3 line-clamp-2" style={{ color: '#9D8189' }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[15px]" style={{ color: '#6D6875' }}>
                        <strong>R$ {product.unitPrice.toFixed(2)}</strong>
                      </span>
                      <span className="text-[12px]" style={{ color: '#9D8189' }}>
                        {product.unitWeight}g
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        onAddProduct(product);
                        handleClose();
                      }}
                      disabled={isAlreadySelected}
                      className="w-full h-9 text-[14px] disabled:opacity-40"
                      style={{
                        backgroundColor: '#F4ACB7',
                        color: 'white'
                      }}
                    >
                      {isAlreadySelected ? 'Já Adicionado' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-[16px]" style={{ color: '#9D8189' }}>
                  Nenhum produto encontrado com "{searchProduct}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex justify-end p-6 border-t"
          style={{ borderColor: '#D8E2DC' }}
        >
          <Button
            onClick={handleClose}
            className="px-6 py-2 h-11 text-[15px]"
            style={{
              backgroundColor: '#F4ACB7',
              color: 'white'
            }}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
