import Styles from "./CardProduto.module.css";

interface CardProdutoProps {
    imagem?: string;
    titulo: string;
    descricao: string;
    preco: string | number;
    peso: string;
    selecionado?: boolean;
    
    onSelecionar?: () => void;
}

export function CardProduto({ 
    imagem, 
    titulo, 
    descricao, 
    preco, 
    peso, 
    selecionado = false, 
    onSelecionar 
}: CardProdutoProps) {
    
  return (
    <div className={Styles.cardProduto}>
        {imagem ? (
            <img src={imagem} alt={titulo} className={Styles.imagemProduto} />
        ) : (
            <div className={Styles.imagemProduto} /> 
        )}
        
        <div className={Styles.infoProduto}>
            <span className={Styles.tituloProduto}>{titulo}</span>
            <span className={Styles.descProduto}>{descricao}</span>
        </div>

        <div>
            <div className={Styles.linhaPreco}>
                <span className={Styles.precoProduto}>
                    {typeof preco === 'number' 
                        ? `R$ ${preco.toFixed(2).replace('.', ',')}` 
                        : preco}
                </span>
                <span className={Styles.pesoProduto}>{peso}</span>
            </div>
            
            <button 
                onClick={onSelecionar}
                className={`${Styles.botao} ${selecionado ? Styles.botaoSelecionado : Styles.botaoDisponivel}`}
            >
                {selecionado ? "Selecionado" : "Selecionar"}
            </button>
        </div>
    </div>
  );
}