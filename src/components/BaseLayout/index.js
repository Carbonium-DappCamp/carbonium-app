import styles from "./styles.module.scss";
import WalletConnectButton from "../WalletConnectButton";

function BaseLayout({ children }) {
	return (
		<div className={styles.container}>
			<h1>Carbonium App</h1>

			{children}
		</div>
	);
}

export default BaseLayout;
