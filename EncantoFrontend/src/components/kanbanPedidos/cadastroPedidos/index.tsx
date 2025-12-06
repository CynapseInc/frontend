import { useState } from "react";
import Styles from "./CadastroPedidos.module.css";
import { Card } from "../../genericos/card";
import { Input } from "../../genericos/input";
import { Button } from "../../genericos/button";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { FiSearch, FiPackage } from "react-icons/fi";
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

    function handleAlterarQuantidade(id: number, novaQuantidade: string) {
        const qtd = parseInt(novaQuantidade);
        if (isNaN(qtd) || qtd < 1) return;

        setProdutosSelecionados(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantidade: qtd };
            }
            return item;
        }));
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
        <div className={Styles.contentPage}>
            <div className={Styles.voltarKanban}>
                <FaArrowLeft/>
                Voltar para Pedidos
            </div>
            <span className={Styles.tituloPage}>Novo Pedido</span>
            <span className={Styles.textoSecundario}>Preencha as informações abaixo para cadastrar um novo pedido</span>
            
            <Card classeCss={Styles.sectionCard}>
                <span className={Styles.tituloSectionCard}>Informações do Cliente</span>
                <div className={Styles.containerInputs}>
                    <div className={Styles.inputBox}>
                        <span className={Styles.tituloInputLabel}>Cliente</span>
                        <div className={Styles.inputRow}>
                            <Input classeCss={Styles.inputCadastro}/>  
                            <Button variante="rosa" classeCss={`${Styles.botao} ${Styles.corBotaoSecundario}`}>
                                <GoPeople />
                                Listar Clientes
                            </Button>     
                            <Button variante="rosa" classeCss={Styles.botao}>
                                <FaPlus/>
                                Novo Cliente
                            </Button>     
                        </div>
                    </div>
                    <div className={Styles.inputBox}>
                        <span className={Styles.tituloInputLabel}>Endereço de Entrega</span>
                        <Input classeCss={Styles.inputCadastro}/>  
                    </div>
                    <div className={Styles.inputBox}>
                        <div className={Styles.inputRow}>
                            <div className={Styles.inputDividida}>
                                <span className={Styles.tituloInputLabel}>Endereço de Entrega</span>
                                <Input multiLinha={true} placeholder="Ex: Cliente solicitou embalagem especial..." classeCss={`${Styles.inputCadastro} ${Styles.inputTextBox}`}/>  
                            </div>
                            <div className={Styles.inputDividida}>
                                <span className={Styles.tituloInputLabel}>Status do Pedido</span>
                                <Input multiLinha={true} classeCss={`${Styles.inputCadastro} ${Styles.inputTextBox}`}/>  
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card classeCss={Styles.sectionCard}>
                <span className={Styles.tituloSectionCard}>Selecionar Produtos</span>
                <div className={Styles.containerInputs}>
                    <div className={Styles.barraPesquisaContainer}>
                        <FiSearch className={Styles.iconePesquisa} />
                        <Input
                            placeholder="Pesquisar produto por nome, categoria, tema ou item..." 
                            classeCss={`${Styles.inputCadastro} ${Styles.inputPesquisa}`}
                            value={busca}
                            onChange={(e: any) => setBusca(e.target.value)} 
                        />
                    </div>

                    <div className={Styles.gridProdutos}>
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
            </Card>

            {produtosSelecionados.length > 0 && (
                <>
                    <Card classeCss={Styles.sectionCard}>
                        <span className={Styles.tituloSectionCard} style={{color: '#F4ACB7', marginBottom: '1vh', display:'block'}}>
                            Produtos Selecionados
                        </span>
                        
                        <div className={Styles.containerInputs}>
                            {produtosSelecionados.map((item) => {
                                const precoTotal = item.preco * item.quantidade;
                                const pesoNumerico = parseFloat(item.peso.replace('kg','').replace(',','.').trim());
                                const pesoTotal = (pesoNumerico * item.quantidade).toFixed(2);

                                return (
                                    <div key={item.id} className={Styles.itemSelecionadoContainer}>
                                        <div className={Styles.cabecalhoItem}>
                                            <div className={Styles.dadosProdutoItem}>
                                                <img src={item.imagem} alt={item.nome} className={Styles.thumbProdutoPequena}/>
                                                <div className={Styles.textosProdutoItem}>
                                                    <span className={Styles.tituloItem}>{item.nome}</span>
                                                    <span className={Styles.descItem}>{item.desc}</span>
                                                </div>
                                            </div>
                                            <button 
                                                className={Styles.botaoRemover}
                                                onClick={() => handleToggleProduto(item)}
                                            >
                                                Remover
                                            </button>
                                        </div>

                                        <div className={Styles.gridInputsValores}>
                                            <div>
                                                <span className={Styles.labelInputPequeno}>Quantidade</span>
                                                <Input 
                                                    classeCss={Styles.inputEditavel} 
                                                    type="number"
                                                    value={item.quantidade.toString()}
                                                    onChange={(e: any) => handleAlterarQuantidade(item.id, e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <span className={Styles.labelInputPequeno}>Preço Unitário</span>
                                                <Input 
                                                    classeCss={Styles.inputEditavel} 
                                                    value={`R$ ${item.preco.toFixed(2)}`} 
                                                    readOnly 
                                                />
                                            </div>
                                            <div>
                                                <span className={Styles.labelInputPequeno}>Preço Total</span>
                                                <Input 
                                                    classeCss={Styles.inputReadOnly} 
                                                    value={`R$ ${precoTotal.toFixed(2)}`} 
                                                    readOnly 
                                                />
                                            </div>
                                            <div>
                                                <span className={Styles.labelInputPequeno}>Peso Unit. (kg)</span>
                                                <Input 
                                                    classeCss={Styles.inputEditavel} 
                                                    value={item.peso.replace('kg','').trim()} 
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <span className={Styles.labelInputPequeno}>Peso Total (kg)</span>
                                                <Input 
                                                    classeCss={Styles.inputReadOnly} 
                                                    value={`${pesoTotal} kg`} 
                                                    readOnly 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card classeCss={Styles.sectionCard}>
                        <span className={Styles.tituloSectionCard} style={{color: '#F4ACB7', marginBottom:'2vh', display:'block'}}>
                            Resumo do Pedido
                        </span>

                        <div className={Styles.containerInputs}>
                            <div className={Styles.containerResumoInfo}>
                                <div className={Styles.boxResumoInfo}>
                                    <span className={Styles.tituloResumoInfo}>Cliente</span>
                                    <span className={Styles.textoResumoInfo}>Maria Silva</span>
                                    <span className={Styles.textoResumoInfo}>(11) 98765-4321</span>
                                </div>
                                <div className={Styles.boxResumoInfo}>
                                    <span className={Styles.tituloResumoInfo}>Endereço de Entrega</span>
                                    <span className={Styles.textoResumoInfo}>Av. Paulista, 1578 - Apto 501</span>
                                    <span className={Styles.textoResumoInfo}>Bela Vista, São Paulo/SP</span>
                                </div>
                            </div>

                            <span className={Styles.tituloInputLabel} style={{marginBottom: '1vh', display:'block'}}>Produtos</span>

                            <div>
                                {produtosSelecionados.map((item) => (
                                    <div key={item.id} className={Styles.linhaResumoProduto}>
                                        <div className={Styles.resumoIconeNome}>
                                            <FiPackage className={Styles.iconeCaixa} />
                                            <div style={{display:'flex', flexDirection:'column'}}>
                                                <span className={Styles.resumoNome}>{item.nome}</span>
                                                <span className={Styles.resumoDetalhe}>
                                                    {item.quantidade} unidade{item.quantidade > 1 ? 's' : ''} x R$ {item.preco.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={Styles.resumoValoresDireita}>
                                            <span className={Styles.resumoNome}>
                                                R$ {(item.preco * item.quantidade).toFixed(2)}
                                            </span>
                                            <span className={Styles.resumoDetalhe}>
                                                {(parseFloat(item.peso.replace('kg','').replace(',','.')) * item.quantidade).toFixed(2)} kg
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={Styles.footerResumo}>
                                <div className={Styles.boxTotalRosa}>
                                    <span className={Styles.labelTotal}>Previsão de Entrega</span>
                                    <span className={Styles.valorTotal}>19/12/2025</span>
                                </div>
                                <div className={Styles.boxTotalRosa}>
                                    <span className={Styles.labelTotal}>Peso Total</span>
                                    <span className={Styles.valorTotal}>{pesoTotalGeral.toFixed(2)} kg</span>
                                </div>
                                <div className={Styles.boxTotalRosa}>
                                    <span className={Styles.labelTotal}>Valor Total</span>
                                    <span className={Styles.valorTotal}>R$ {valorTotalGeral.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className={Styles.botaoConfirmarContainer}>
                         <Button variante="rosa" classeCss={Styles.botaoConfirmar}>
                            Confirmar Pedido
                         </Button>
                    </div>
                </>
            )}
        </div>
    )
}