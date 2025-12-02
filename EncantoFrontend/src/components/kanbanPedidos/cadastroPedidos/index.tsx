import Styles from "./CadastroPedidos.module.css";
import { Card } from "../../genericos/card";
import { Input } from "../../genericos/input";
import { FaArrowLeft } from "react-icons/fa6";


export function CadastroPedidos() {
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
                <span className={Styles.tituloInputLabel}>Cliente</span>
                <Input/>  
            </div>
        </Card>
    </div>
  )
}