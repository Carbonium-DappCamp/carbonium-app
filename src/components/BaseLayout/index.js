import styles from "./styles.module.scss";
import WalletConnectButton from "../WalletConnectButton";
import TransferParcels from "../TransferParcels";

function BaseLayout({ children }) {
	return (
		<div className={styles.container}>
			<h1>Carbonium App</h1>
			<TransferParcels></TransferParcels>
			<WalletConnectButton></WalletConnectButton>
			{children}
		</div>
	);
}

export default BaseLayout;
