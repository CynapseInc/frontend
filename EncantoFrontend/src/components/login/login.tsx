import styles from './login.module.css';

export default function Login(){

     return (
    <div className={styles.conteudo}>
      <div className={styles.CardMain}>
        <div className={styles.DecorationTop}>
            <div className={styles.icon}>goku</div>
            <img src="./src/assets/logoEncanto.png" alt="" />
            <div className={styles.subtitle}>picollo</div>
            <div className={styles.subtitle}>vegeta</div>
        </div>
      </div>
    </div>
  );

}