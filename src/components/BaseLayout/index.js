import './styles.css';

function BaseLayout({ children }) {
  return (
    <div className="container">
      <h1>Carbonium App</h1>
      {children}
    </div>
  );
}

export default BaseLayout;
