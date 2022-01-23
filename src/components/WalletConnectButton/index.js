import styles from "./styles.module.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const WalletConnectButton = async () => {
	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider, // required
			options: {
				infuraId: "45e623f61bb54dcb93fadeff47247315", // required
			},
		},
	};

	const web3Modal = new Web3Modal({
		network: "mainnet", // optional
		cacheProvider: true, // optional
		providerOptions, // required
	});

	const instance = await web3Modal.connect();

	const provider = new ethers.providers.Web3Provider(instance);
	const signer = provider.getSigner();
	console.log(signer);
};

export default WalletConnectButton;
