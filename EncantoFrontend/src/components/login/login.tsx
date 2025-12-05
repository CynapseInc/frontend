import styles from './login.module.css';
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";



export default function Login() {

  return (
    <div className={styles.conteudo}>
      <div className={styles.CardMain}>
        <div className={styles.DecorationTop}>
          <div className={styles.icon}><IoIosArrowBack /></div>
          <img src="./src/assets/logoEncanto.png" alt="" />
          <div style={{fontSize:'20px'}} className={styles.subtitle}>Área do Administrador</div>
          <div className={styles.subtitle}>Entre com suas credenciais</div>
        </div>
        <div className={styles.inputArea}>

          E-mail
          <div className={styles.inputCaseAlt}>

             <div className={styles.iconInput}><MdOutlineMail/></div>
            <input style={{height:'90%', width:'96%', borderRadius:'10px'}} type="text" />

            



          </div>

          Senha
          <div className={styles.inputCase}>
             <div className={styles.iconInput}><FiLock/></div>
            <input style={{height:'90%', borderRadius:'10px'}} type="text" />

             <div className={styles.iconInput}><AiOutlineEye/> </div>
                     </div>

        </div>

        <div className={styles.inputMisc}>
          <div style={{display:'flex'}}>
            <input style={{scale:'1.2'}} type="checkbox" name="lembrarMe" id="lembrarMe" />
            Lembrar-me
          </div>

          <div style={{color:'#fecad4'}}>Esqueci minha senha</div>
        </div>
        <div className={styles.buttonLogin}>Entrar</div>

        <div className={styles.aviso}>
          Acesso exclusivo para administradores
        </div>

      </div>
    </div>
  );

}