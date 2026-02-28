import Styles from "./despesasPorCategoria.module.css";
import { ProgressBar } from "../../genericos/progressBar";
import { Card } from "../../genericos/card";

// Apenas as 4 categorias solicitadas
const despesas = [
    { id: 1, nome: "Funcionários", valor: "R$ 15.000,00", pct: 60, cor: "#FFCAD4" },
    { id: 2, nome: "Fornecedores", valor: "R$ 12.500,00", pct: 50, cor: "#F4ACB7" },
    { id: 3, nome: "Prolabore", valor: "R$ 8.000,00", pct: 32, cor: "#FFE5D9" },
    { id: 4, nome: "Freelancers", valor: "R$ 6.200,00", pct: 24.8, cor: "#D8E2DC" },
];

export function DespesasPorCategoria(){
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