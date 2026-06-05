import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../ui/dialog';
import { X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import ItemCombobox from './ItemCombobox';

import '../index-cadastro.css'

interface Item {
  id: string;
  description: string;
  salePrice: number;
  productionCost: number;
  productionDeadline: string;
  width: string;
  height: string;
  weight: string;
  length: string;
  material: string;
  descricaoPadrao?: string;
  promotionalPrice: number;
  unitPrice: number;
  minimumQuantity: number;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  item?: Item | null;
  items: Item[];
}

export default function ItemModal({ isOpen, onClose, onSave, item, items }: ItemModalProps) {
  const [description, setDescription] = useState('');
  const [productionCost, setProductionCost] = useState('');
  const [productionDeadline, setProductionDeadline] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [material, setMaterial] = useState('');
  const [descricaoPadrao, setDescricaoPadrao] = useState('');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [minimumQuantity, setMinimumQuantity] = useState('');
  const [baseItemId, setBaseItemId] = useState('');

  // Calcular preço de venda automaticamente
  const salePrice = parseFloat(unitPrice || '0') * parseFloat(minimumQuantity || '0');

  useEffect(() => {
    if (item) {
      setDescription(item.description);
      setProductionCost(item.productionCost.toString());
      setProductionDeadline(item.productionDeadline);
      setWidth(item.width);
      setHeight(item.height);
      setWeight(item.weight);
      setLength(item.length);
      setMaterial(item.material);
      setDescricaoPadrao(item.descricaoPadrao || '');
      setPromotionalPrice(item.promotionalPrice.toString());
      setUnitPrice(item.unitPrice.toString());
      setMinimumQuantity(item.minimumQuantity.toString());
      setBaseItemId('');
    } else {
      clearForm();
    }
  }, [item, isOpen]);

  const clearForm = () => {
    setDescription('');
    setProductionCost('');
    setProductionDeadline('');
    setWidth('');
    setHeight('');
    setWeight('');
    setLength('');
    setMaterial('');
    setDescricaoPadrao('');
    setPromotionalPrice('');
    setUnitPrice('');
    setMinimumQuantity('');
    setBaseItemId('');
  };

  const handleBaseItemChange = (selectedItemId: string, selectedItem?: Item | null) => {
    setBaseItemId(selectedItemId);
    if (selectedItem) {
      setDescription(selectedItem.description);
      setProductionCost(selectedItem.productionCost.toString());
      setProductionDeadline(selectedItem.productionDeadline);
      setWidth(selectedItem.width);
      setHeight(selectedItem.height);
      setWeight(selectedItem.weight);
      setLength(selectedItem.length);
      setMaterial(selectedItem.material);
      setPromotionalPrice(selectedItem.promotionalPrice.toString());
      setUnitPrice(selectedItem.unitPrice.toString());
      setMinimumQuantity(selectedItem.minimumQuantity.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSave({
      id: item?.id || '',
      description: description.trim(),
      salePrice,
      productionCost: parseFloat(productionCost || '0'),
      productionDeadline,
      width,
      height,
      weight,
      length,
      material,
      descricaoPadrao,
      promotionalPrice: parseFloat(promotionalPrice || '0'),
      unitPrice: parseFloat(unitPrice || '0'),
      minimumQuantity: parseFloat(minimumQuantity || '0'),
    });

    clearForm();
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="p-0 gap-0 [&>button]:hidden overflow-y-auto"
        style={{
          backgroundColor: 'white',
          border: '1px solid #D8E2DC',
          maxWidth: '800px',
          maxHeight: '90vh'
        }}
      >
        <DialogTitle className="sr-only">
          {item ? 'Editar Item' : 'Novo Item'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados do item
        </DialogDescription>

        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: '#D8E2DC' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[28px]" style={{ color: '#F4ACB7' }}>
              {item ? 'Editar Item' : 'Novo Item'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: '#9D8189' }}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-5">

            {/* Basear em item existente */}
            {!item && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFE5D9' }}>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Basear em item existente (opcional)
                </label>
                <ItemCombobox
                  value={baseItemId}
                  onChange={handleBaseItemChange}
                  items={items}
                />
                <p className="text-[13px] mt-2" style={{ color: '#9D8189' }}>
                  Selecione um item para copiar suas informações e editá-las
                </p>
              </div>
            )}

            {/* Descrição */}
            <div>
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                Item <span style={{ color: '#F4ACB7' }}>*</span>
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Caneca, Caderno..."
                className="h-11 text-[15px]"
                style={{
                  borderColor: '#D8E2DC',
                  color: '#6D6875'
                }}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                Descrição Padrão
              </label>
              <textarea
                value={descricaoPadrao}
                onChange={(e) => setDescricaoPadrao(e.target.value)}
                placeholder="Ex: Caneca de cerâmica 325ml. Pode ir ao micro-ondas..."
                className="w-full min-h-[100px] px-4 py-3 rounded-md text-[15px] border transition-all focus:outline-none"
                style={{ borderColor: '#D8E2DC', color: '#6D6875' }}
              />
              <p className="text-[13px] mt-1" style={{ color: '#9D8189' }}>
                Este texto será carregado automaticamente na tela de Produto quando este item for selecionado.
              </p>
            </div>


            {/* Linha 1: Preço e Custo */}
            <div className="grid grid-cols-2 gap-4 modal-grid">
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Preço Unitário <span style={{ color: '#F4ACB7' }}>*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Quantidade Mínima <span style={{ color: '#F4ACB7' }}>*</span>
                </label>
                <Input
                  type="number"
                  value={minimumQuantity}
                  onChange={(e) => setMinimumQuantity(e.target.value)}
                  placeholder="0"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                  required
                />
              </div>
            </div>

            {/* Preço de Venda Calculado */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#D8E2DC' }}>
              <label className="block text-[15px] mb-1" style={{ color: '#6D6875' }}>
                Preço de Venda (calculado)
              </label>
              <p className="text-[22px]" style={{ color: '#F4ACB7' }}>
                <strong>R$ {salePrice.toFixed(2)}</strong>
              </p>
              <p className="text-[13px] mt-1" style={{ color: '#9D8189' }}>
                Quantidade Mínima × Preço Unitário
              </p>
            </div>

            {/* Linha 2: Custo e Prazo */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 modal-grid">
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Custo de Produção
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={productionCost}
                  onChange={(e) => setProductionCost(e.target.value)}
                  placeholder="0.00"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Prazo de Produção
                </label>
                <Input
                  value={productionDeadline}
                  onChange={(e) => setProductionDeadline(e.target.value)}
                  placeholder="Ex: 3 dias, 1 semana..."
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
            </div>

            {/* Linha 3: Dimensões */}
            <div className="grid grid-cols-4 gap-4 modal-grid">
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Largura
                </label>
                <Input
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Ex: 10cm"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Altura
                </label>
                <Input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ex: 15cm"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Peso
                </label>
                <Input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 200g"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Comprimento
                </label>
                <Input
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Ex: 8cm"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
            </div>

            {/* Linha 4: Material e Preço Promocional */}
            <div className="grid grid-cols-2 gap-4 modal-grid">
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Material
                </label>
                <Input
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ex: Cerâmica, Papel..."
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
              <div>
                <label className="block text-[15px] mb-2" style={{ color: '#6D6875' }}>
                  Preço Promocional
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={promotionalPrice}
                  onChange={(e) => setPromotionalPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-11 text-[15px]"
                  style={{
                    borderColor: '#D8E2DC',
                    color: '#6D6875'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t flex justify-end gap-3" style={{ backgroundColor: '#F9F9F9', borderColor: '#D8E2DC' }}>
            <Button
              type="button"
              onClick={handleClose}
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
              type="submit"
              className="px-6 py-2 h-11 text-[15px]"
              style={{
                backgroundColor: '#F4ACB7',
                color: 'white'
              }}
            >
              {item ? 'Salvar Alterações' : 'Cadastrar Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
