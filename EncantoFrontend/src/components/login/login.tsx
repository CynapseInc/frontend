import styles from './login.module.css';

export default function Login() {

  return (
    <div className={styles.conteudo}>
      <div className={styles.CardMain}>
        <div className={styles.DecorationTop}>
          <div className={styles.icon}>goku</div>
          <img src="./src/assets/logoEncanto.png" alt="" />
          <div className={styles.subtitle}><h3>Área do Administrador</h3></div>
          <div className={styles.subtitle}>Entre com suas credenciais</div>
        </div>
        <div className={styles.inputArea}>

          E-mail
          <div className={styles.inputCase}>
            
          <input type="text" />
                    <input type="text" />

          <input type="text" />

          
          
          </div>

          Senha
           <div className={styles.inputCase}>
          <input type="text" />
          </div>

        </div>

        <div className={styles.inputMisc}></div>
        <div className={styles.buttonLogin}>Entrar</div>

        <div className={styles.aviso}>
          Acesso exclusivo para administradores
        </div>

      </div>
    </div>
  );

}