import Styles from "./despesasPorCategoria.module.css";
import { ProgressBar } from "../../genericos/progressBar";
import { Card } from "../../genericos/card";

interface DespesaItem {
  id: number;
  nome: string;
  valor: string;
  pct: number;
  cor: string;
}

interface DespesasPorCategoriaProps {
  despesas: DespesaItem[];
}

export function DespesasPorCategoria({ despesas }: DespesasPorCategoriaProps) {
    if (!despesas || despesas.length === 0) {
        return (
            <Card classeCss={Styles.cardDespesas}>
                <span className={Styles.tituloGrafico}>Despesas Por Categoria</span>
                <div className={Styles.scrollArea} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>Sem dados</p>
                </div>
            </Card>
        );
    }
    return(
        <Card classeCss={Styles.cardDespesas}>
            <span className={Styles.tituloGrafico}>Despesas Por Categoria</span>
            {/* O container com scroll envolve o .map */}
            <div className={Styles.scrollArea}>
                {despesas.map((item) => (
                    <div key={item.id} className={Styles.itemContainer}>
                        {/* 1. Nome e Valor */}
                        <div className={Styles.headerContainer}>
                            <span className={Styles.headerTxt}>{item.nome}</span>
                            <span className={Styles.headerTxt}>{item.valor}</span>
                        </div>
                        {/* 2. Barra de Progresso */}
                        <ProgressBar 
                            cor={item.cor} 
                            progresso={item.pct}
                        />
                        {/* 3. Porcentagem embaixo */}
                        <span className={Styles.porcentagem}>{item.pct}% do total</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}