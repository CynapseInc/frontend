import { useState } from "react";
import { Input } from "../../genericos/input";
import { Button } from "../../genericos/button";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { CardProduto } from "./cardProdutos";

import CanecaBen10 from "../../../assets/canecaBen10.jpg";
import CanecaSpiderman from "../../../assets/canecaSpiderman.jpg";
import CadernoCorinthians from "../../../assets/cadernoCorinthians.jpg";
import CadernoFrozen from "../../../assets/cadernoFrozen.jpg";

interface Produto {
  id: number;
  nome: string;
  imagem: string;
  desc: string;
  preco: number; 
  peso: string;
}

interface ProdutoSelecionado extends Produto {
  quantidade: number;
}

const produtosMock: Produto[] = [
  { id: 1, nome: "Caneca do Ben 10", imagem: CanecaBen10, desc: "Caneca personalizada com estampa do Ben 10 em cerâmica", preco: 35.00, peso: "0.35 kg" },
  { id: 2, nome: "Caderno da Frozen", imagem: CadernoFrozen, desc: "Caderno universitário com capa personalizada da Frozen", preco: 45.00, peso: "0.50 kg" },
  { id: 3, nome: "Caneca do Spider-Man", imagem: CanecaSpiderman, desc: "Caneca personalizada com estampa do Spider-Man", preco: 35.00, peso: "0.35 kg" },
  { id: 4, nome: "Caderno do Corinthians", imagem: CadernoCorinthians, desc: "Caderno escolar com tema do Corinthians", preco: 40.00, peso: "0.45 kg" },
];

export function CadastroPedidos() {
    const [busca, setBusca] = useState("");
    const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);

    function handleToggleProduto(produto: Produto) {
        const jaEstaSelecionado = produtosSelecionados.some(p => p.id === produto.id);

        if (jaEstaSelecionado) {
            setProdutosSelecionados(prev => prev.filter(p => p.id !== produto.id));
        } else {
            setProdutosSelecionados(prev => [...prev, { ...produto, quantidade: 1 }]);
        }
    }

    const produtosFiltrados = produtosMock.filter((produto) => {
        const textoBusca = busca.toLowerCase();
        return produto.nome.toLowerCase().includes(textoBusca) || 
               produto.desc.toLowerCase().includes(textoBusca);
    });

    const valorTotalGeral = produtosSelecionados.reduce((acc, item) => {
        return acc + (item.preco * item.quantidade);
    }, 0);

    const pesoTotalGeral = produtosSelecionados.reduce((acc, item) => {
        const pesoNum = parseFloat(item.peso.replace('kg','').replace(',','.').trim());
        return acc + (pesoNum * item.quantidade);
    }, 0);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="max-w-[1600px] mx-auto px-8 py-8">
                
                {/* Cabeçalho */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <button className="flex items-center gap-2 text-[#9D8189] hover:text-[#F4ACB7] transition-colors">
                            <FaArrowLeft className="size-4" />
                            Voltar para Pedidos
                        </button>
                    </div>
                    <h1 className="text-[48px] mb-2" style={{ color: '#F4ACB7' }}>Novo Pedido</h1>
                    <p className="text-[17px]" style={{ color: '#9D8189' }}>
                        Preencha as informações abaixo para cadastrar um novo pedido
                    </p>
                </div>

                <div className="grid grid-cols-[320px_1fr_400px] gap-6">
                    
                    {/* COLUNA ESQUERDA - Informações do Cliente */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-5 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
                            <h3 className="text-[18px] mb-4" style={{ color: '#F4ACB7' }}>
                                <strong>Informações do Cliente</strong>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[#6D6875] font-bold mb-2">Cliente</label>
                                    <div className="flex gap-2">
                                        <Input classeCss="flex-1 border border-[#D8E2DC] rounded h-10" />
                                        <Button classeCss="px-3 py-2 h-10">
                                            <GoPeople className="size-4" />
                                        </Button>
                                        <Button classeCss="px-3 py-2 h-10">
                                            <FaPlus className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#6D6875] font-bold mb-2">Endereço de Entrega</label>
                                    <Input classeCss="w-full border border-[#D8E2DC] rounded h-10" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[#6D6875] font-bold mb-2">Observações</label>
                                        <Input multiLinha={true} classeCss="w-full border border-[#D8E2DC] rounded h-20 resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#6D6875] font-bold mb-2">Status</label>
                                        <Input classeCss="w-full border border-[#D8E2DC] rounded h-10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA CENTRAL - Seleção de Produtos */}
                    <div>
                        <div className="bg-white rounded-lg p-5 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
                            <h3 className="text-[18px] mb-4" style={{ color: '#F4ACB7' }}>
                                <strong>Selecionar Produtos</strong>
                            </h3>
                            <div className="mb-4 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#9D8189]" />
                                <Input
                                    placeholder="Pesquisar produto..."
                                    classeCss="w-full pl-10 border border-[#D8E2DC] rounded h-10"
                                    value={busca}
                                    onChange={(e: any) => setBusca(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {produtosFiltrados.map((produto) => {
                                    const isSelected = produtosSelecionados.some(sel => sel.id === produto.id);
                                    return (
                                        <CardProduto
                                            key={produto.id}
                                            titulo={produto.nome}
                                            imagem={produto.imagem}
                                            descricao={produto.desc}
                                            preco={produto.preco}
                                            peso={produto.peso}
                                            selecionado={isSelected}
                                            onSelecionar={() => handleToggleProduto(produto)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA - Produtos Selecionados e Resumo */}
                    <div className="space-y-6">
                        {produtosSelecionados.length > 0 && (
                            <>
                                <div className="bg-white rounded-lg p-5 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
                                    <h3 className="text-[18px] mb-4" style={{ color: '#F4ACB7' }}>
                                        <strong>Produtos Selecionados</strong>
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {produtosSelecionados.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.imagem} alt={item.nome} className="w-12 h-12 rounded" />
                                                    <div>
                                                        <p className="text-sm font-bold text-[#6D6875]">{item.nome}</p>
                                                        <p className="text-xs text-[#9D8189]">Qtd: {item.quantidade}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="text-[#F44336] hover:text-[#D32F2F]"
                                                    onClick={() => handleToggleProduto(item)}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-5 shadow-sm" style={{ border: '1px solid #D8E2DC' }}>
                                    <h3 className="text-[18px] mb-4" style={{ color: '#F4ACB7' }}>
                                        <strong>Resumo do Pedido</strong>
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-[#6D6875]">Peso Total</span>
                                            <span className="text-sm font-bold text-[#F4ACB7]">{pesoTotalGeral.toFixed(2)} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-[#6D6875]">Valor Total</span>
                                            <span className="text-lg font-bold text-[#F4ACB7]">R$ {valorTotalGeral.toFixed(2)}</span>
                                        </div>
                                        <Button classeCss="w-full mt-4 px-6 py-3 text-lg">
                                            Confirmar Pedido
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}