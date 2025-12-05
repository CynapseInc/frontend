import Styles from "./CadastroPedidos.module.css";
import { Card } from "../../genericos/card";
import { Input } from "../../genericos/input";
import { Button } from "../../genericos/button";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";

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
            conteudo 2
        </Card>
    </div>
  )
}