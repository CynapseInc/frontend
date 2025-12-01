import Styles from "./despesasPorCategoria.module.css";
import { ProgressBar } from "../../genericos/progressBar";
import { Card } from "../../genericos/card";


export function DespesasPorCategoria(){
    return(
        <Card classeCss={Styles.cardDespesas}>
            <span className={Styles.tituloGrafico}>Despesas Por Categoria</span>
            <div className={Styles.containerProgressBar}>
                <div className={Styles.headerContainer}>
                    <span className={Styles.headerTxt}>Funcionários</span>
                    <span className={Styles.headerTxt}>R$ 15.000,00</span>
                </div>
                <ProgressBar cor="#FFCAD4" progresso={60}/>
                <span className={Styles.porcentagem}>60.0% do total</span>
            </div>
            <div className={Styles.containerProgressBar}>
                <div className={Styles.headerContainer}>
                    <span className={Styles.headerTxt}>Fornecedores</span>
                    <span className={Styles.headerTxt}>R$ 12.500,00</span>
                </div>
                <ProgressBar cor="#F4ACB7" progresso={50}/>
                <span className={Styles.porcentagem}>50.0% do total</span>
            </div>

            <div className={Styles.containerProgressBar}>
                <div className={Styles.headerContainer}>
                    <span className={Styles.headerTxt}>Prolabore</span>
                    <span className={Styles.headerTxt}>R$ 8.000,00</span>
                </div>
                <ProgressBar cor="#FFE5D9" progresso={32}/>
                <span className={Styles.porcentagem}>32.0% do total</span>
            </div>

            <div className={Styles.containerProgressBar}>
                <div className={Styles.headerContainer}>
                    <span className={Styles.headerTxt}>Freelancers</span>
                    <span className={Styles.headerTxt}>R$ 6.200,00</span>
                </div>
                <ProgressBar cor="#D8E2DC" progresso={24.8}/>
                <span className={Styles.porcentagem}>24.8% do total</span>
            </div>
        </Card>
    )
}