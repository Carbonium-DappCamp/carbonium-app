import styles from './styles.module.scss';

function BaseLayout({ children }) {
  return (
    <div className={styles.container}>
      <h1>Carbonium App</h1>
      {children}
    </div>
  );
}

export default BaseLayout;
