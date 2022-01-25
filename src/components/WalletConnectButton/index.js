import styles from "./styles.module.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import React, { useState } from "react";
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
	let provider;

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
		try {
			provider = await web3Modal.connect();
		} catch (e) {
			console.log("Could not get a wallet connection", e);
			return;
		}

		// Subscribe to accounts change
		provider.on("accountsChanged", (_accounts) => {
			setAccounts(_accounts);
			console.log("Accounts: ", accounts);
		});

		// Subscribe to chainId change
		provider.on("chainChanged", (_chainId) => {
			setChainId(_chainId);
			console.log("ChainID: ", chainId);
		});

		// Subscribe to networkId change
		provider.on("networkChanged", (_networkId) => {
			setNetworkId(_networkId);
			console.log("Network Id: ", networkId);
		});

		await fetchAccountData();
	}

	const WalletConnected = () => (
		<div className={styles.connectedContainer}>{accounts[0]}</div>
	);

	return accounts === null ? (
		<button onClick={onConnect} id={styles.WalletConnectButton}>
			Connect Wallet
		</button>
	) : (
		<WalletConnected></WalletConnected>
	);
};

export default WalletConnectButton;
