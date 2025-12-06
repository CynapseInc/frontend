import Styles from "./CadastroPedidos.module.css";
import { Card } from "../../genericos/card";
import { Input } from "../../genericos/input";
import { Button } from "../../genericos/button";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { CardProduto } from "./cardProdutos"; 
import { useState } from "react";

// Imagens
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

const produtosMock: Produto[] = [
  { id: 1, nome: "Caneca do Ben 10", imagem: CanecaBen10, desc: "Caneca personalizada com estampa do Ben 10 em cerâmica", preco: 35.00, peso: "0.35 kg" },
  { id: 2, nome: "Caderno da Frozen", imagem: CadernoFrozen, desc: "Caderno universitário com capa personalizada da Frozen", preco: 45.00, peso: "0.50 kg" },
  { id: 3, nome: "Caneca do Spider-Man", imagem:CanecaSpiderman, desc: "Caneca personalizada com estampa do Spider-Man", preco: 35.00, peso: "0.35 kg" },
  { id: 4, nome: "Caderno do Corinthians", imagem:CadernoCorinthians, desc: "Caderno escolar com tema do Corinthians", preco: 40.00, peso: "0.45 kg" },
];

export function CadastroPedidos() {
    const [busca, setBusca] = useState("");
    const [produtosSelecionados, setProdutosSelecionados] = useState<Produto[]>([]);

    function handleToggleProduto(produto: Produto) {
        const jaEstaSelecionado = produtosSelecionados.some(p => p.id === produto.id);

        if (jaEstaSelecionado) {
            setProdutosSelecionados(prev => prev.filter(p => p.id !== produto.id));
        } else {
            setProdutosSelecionados(prev => [...prev, produto]);
        }
    }

    const produtosFiltrados = produtosMock.filter((produto) => {
        const textoBusca = busca.toLowerCase();
        return produto.nome.toLowerCase().includes(textoBusca) || 
               produto.desc.toLowerCase().includes(textoBusca);
    });

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
                                <Input multiLinha={true} classeCss={`${Styles.inputCadastro} ${Styles.inputTextBox}`}/>  
                            </div>
                            <div className={Styles.inputDividida}>
                                <span className={Styles.tituloInputLabel}>Status do Pedido</span>
                                <Input multiLinha={true} placeholder="Teste" classeCss={`${Styles.inputCadastro} ${Styles.inputTextBox}`}/>  
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
                        placeholder="Pesquisar produto por nome, categoria..." 
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
            <Card classeCss={Styles.sectionCard}>
                <span className={Styles.tituloSectionCard} style={{color: '#F4ACB7'}}>
                    Produtos Selecionados
                </span>
                
                <div className={Styles.containerInputs}>
                    {produtosSelecionados.map((item) => (
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
                                    <span className={Styles.tituloInputLabel}>Quantidade</span>
                                    <Input classeCss={`${Styles.inputCadastro} ${Styles.inputEditavel}`} placeholder="1" type="number" />
                                </div>
                                <div>
                                    <span className={Styles.tituloInputLabel}>Preço Unitário</span>
                                    <Input classeCss={`${Styles.inputCadastro} ${Styles.inputEditavel}`} value={item.preco.toString()} readOnly />
                                </div>
                                <div>
                                    <span className={Styles.tituloInputLabel}>Preço Total</span>
                                    <Input classeCss={`${Styles.inputCadastro} ${Styles.inputReadOnly}`} value={item.preco.toFixed(2)} readOnly />
                                </div>
                                <div>
                                    <span className={Styles.tituloInputLabel}>Peso Unit. (kg)</span>
                                    <Input classeCss={`${Styles.inputCadastro} ${Styles.inputEditavel}`} value={item.peso} readOnly />
                                </div>
                                <div>
                                    <span className={Styles.tituloInputLabel}>Peso Total (kg)</span>
                                    <Input classeCss={`${Styles.inputCadastro} ${Styles.inputReadOnly}`} value={item.peso} readOnly />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        )}
        </div>
    )
}