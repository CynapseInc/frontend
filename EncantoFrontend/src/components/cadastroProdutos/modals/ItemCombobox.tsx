import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { itemService } from '../../../services/ItemService';

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

interface ItemComboboxProps {
  value: string;
  onChange: (item: Item) => void;
  items: Item[];
  isErr?: boolean;
  itemSelected?: string | null;
}

export default function ItemCombobox({ value, onChange, items, isErr, itemSelected }: ItemComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState(itemSelected);
  const searchTimeoutRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);


  useEffect(() => {
    if (itemSelected != undefined) {
      setSelectedName(itemSelected);
    }

  }, [ itemSelected])

  useEffect(() => {
    if (value) {
      const selected = items.find(item => item.id === value);
      if (selected) {
        setSelectedName(selected.description);
      }
    } else {
      setSelectedName('');
    }
  }, [value, items]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
            
              
              if(searchTimeoutRef.current) {
                window.clearTimeout(searchTimeoutRef.current);
              }
        
              searchTimeoutRef.current = window.setTimeout(async () => {
        
              try {
                const data = await itemService.listarTodos({ search: search });
                
                
                // mapear os nomes da resposta para o formato esperado
                
                const mappedItems = data.content.map((item: any) => ({
                  id: item.id,
                  description: item.descricao,
                  salePrice:  item.precoVenda || 0,
                  productionCost: item.custoProducao || 0,
                  productionDeadline: item.prazoProducao || '',
                  width: item.largura || '',
                  height: item.altura || '',
                  weight: item.peso || '',
                  length: item.comprimento || '',
                  material: item.material || '',
                  descricaoPadrao: item.descricaoPadrao || '',
                  promotionalPrice: item.precoPromocional || 0,
                  unitPrice: item.precoUnitario || 0,
                  minimumQuantity: item.quantidadeMinima || 0
                }));
               
                setFilteredItems(mappedItems);
              } catch (error) {
                console.error('Erro ao buscar itens:', error);
              }
            },
            500)
           
            
          }, [search])
  

  const handleSelect = (item: Item) => {
    onChange(item);
    setSelectedName(item.description);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSelectedName('');
    setSearch('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 rounded-md border text-[15px] text-left flex items-center justify-between focus:outline-none focus:border-[#F4ACB7] transition-colors"
        style={{
          backgroundColor: '#F9F9F9',
          borderColor: isErr ? '#FF6B6B' : '#D8E2DC',
          color: selectedName ? '#6D6875' : '#9D8189'
        }}
      >
        <span>{selectedName || 'Selecione um item (opcional)...'}</span>
        <div className="flex items-center gap-2">
          {selectedName && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0 hover:opacity-70"
            >
              <X className="size-4" />
            </button>
          )}
          <ChevronDown 
            className="size-4 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-50"
          style={{ borderColor: '#D8E2DC' }}
        >
          <div className="p-2 border-b" style={{ borderColor: '#D8E2DC' }}>
            <input
              type="text"
              placeholder="Pesquisar item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-[14px] focus:outline-none focus:border-[#F4ACB7]"
              style={{
                backgroundColor: '#F9F9F9',
                borderColor: '#D8E2DC',
                color: '#6D6875'
              }}
              autoFocus
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-[14px]" style={{ color: '#9D8189' }}>
                Nenhum item encontrado
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 text-left text-[14px] flex items-center justify-between hover:bg-gray-100 transition-colors border-0"
                  style={{
                    color: '#6D6875',
                    backgroundColor: value === item.id ? '#F0F0F0' : 'transparent'
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.description}</div>
                    <div className="text-[12px]" style={{ color: '#9D8189' }}>
                      R$ {item.salePrice.toFixed(2)} | {item.material}
                    </div>
                  </div>
                  {value === item.id && (
                    <Check className="size-4 ml-2" style={{ color: '#F4ACB7' }} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
