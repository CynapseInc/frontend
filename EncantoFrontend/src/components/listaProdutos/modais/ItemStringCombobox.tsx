import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';
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
  onChange: (id: string, item?: Item | null) => void;
  items: string[];
  isErr?: boolean;
}

export default function ItemCombobox({ value, onChange, items, isErr }: ItemComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const searchTimeoutRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const selected = items.find(item => item === value);
      if (selected) {
        setSelectedName(selected);
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
              
              const mappedItems = data.content.map((item: any) => item.descricao);
             
              setFilteredItems(mappedItems);
            } catch (error) {
              console.error('Erro ao buscar itens:', error);
            }
          },
          500)
         
          
        }, [search])

  

  const handleSelect = (item: string) => {

    onChange(item);
    setSelectedName(item);
    setOpen(false);
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
        <ChevronDown
          className="size-4 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-50"
          style={{ borderColor: '#D8E2DC' }}
        >
          <div className="px-4 py-2 border-b" style={{ borderColor: '#D8E2DC' }}>
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
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2.5 text-left text-[14px] flex items-center justify-between hover:bg-gray-100 transition-colors border-0"
                  style={{
                    color: '#6D6875',
                    backgroundColor: value === item ? '#F0F0F0' : 'transparent'
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{item}</div>
                    
                  </div>
                  {value === item && (
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
