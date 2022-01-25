import styles from "./styles.module.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";

const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			infuraId: "45e623f61bb54dcb93fadeff47247315",
		},
	},
};

const web3Modal = new Web3Modal({
	cacheProvider: true, // optional
	providerOptions, // required
});

const WalletConnectButton = () => {
	const [accounts, setAccounts] = useState(null);
	const [chainId, setChainId] = useState();
	const [networkId, setNetworkId] = useState();
	const provider = useRef(null);

	// Attempt to reconnect to wallet on reload
	useEffect(() => {
		(async () => {
			provider.current = await Web3Modal.connect();
		})().catch((err) => {});
		if (attemptConnection()) {
		}
	}, []);

	async function fetchAccountData() {
		// Get a Web3 instance for the wallet
		const web3 = new Web3(provider);

		console.log("Web3 instance is", web3);

		// Get connected chain id from Ethereum node
		const chainId = await web3.eth.getChainId();
		console.log(chainId);

		const accounts = await web3.eth.getAccounts();

		// MetaMask does not give you all accounts, only the selected account
		console.log("Got accounts", accounts);
		setAccounts(accounts);
	}

	async function onConnect() {
		console.log("Opening a dialog", web3Modal);
		attemptConnection();

		console.log("Current provider is", provider);

		// Subscribe to accounts change
		provider.current.on("accountsChanged", (_accounts) => {
			setAccounts(_accounts);
			console.log("Accounts: ", accounts);
		});

		// Subscribe to chainId change
		provider.current.on("chainChanged", (_chainId) => {
			setChainId(_chainId);
			console.log("ChainID: ", chainId);
		});

		// Subscribe to networkId change
		provider.current.on("networkChanged", (_networkId) => {
			setNetworkId(_networkId);
			console.log("Network Id: ", networkId);
		});

		await fetchAccountData();
	}

	async function attemptConnection() {
		try {
			provider.current = await web3Modal.connect();
			return true;
		} catch (e) {
			console.log("Could not get a web3Modal connection.\n", e);
			return false;
		}
	}

	// Currently not called by anything
	async function onDisconnect() {
		if (accounts === null) {
			console.log("Nothing to disconnect");
			return;
		}
		console.log("Killing the wallet connection", provider);
		await provider.close();

		// If the cached provider is not cleared,
		// WalletConnect will default to the existing session
		// and does not allow to re-scan the QR code with a new wallet.
		// Depending on your use case you may want or want not his behavir.
		await web3Modal.clearCachedProvider();
		provider.current = null;

		setAccounts(null);
	}

	return (
		<>
			<button onClick={onConnect} id={styles.WalletConnectButton}>
				{accounts === null
					? "Connect Wallet"
					: accounts[0].substring(0, 5) +
					  "..." +
					  accounts[0].substring(accounts[0].length - 4, accounts[0].length)}
			</button>
		</>
	);
};

export default WalletConnectButton;
