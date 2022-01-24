import styles from "./styles.module.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import React, { useState } from "react";
import Web3 from "web3";

let provider;
let web3Modal;
let currentAccount;
let setConnectedAccount;

const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			infuraId: "45e623f61bb54dcb93fadeff47247315",
		},
	},
};

web3Modal = new Web3Modal({
	cacheProvider: false, // optional
	providerOptions, // required
});

async function onConnect() {
	console.log("Opening a dialog", web3Modal);
	try {
		provider = await web3Modal.connect();
		const web3 = new Web3(provider);
		const accounts = await web3.eth.getAccounts();
		currentAccount = accounts[0];
	} catch (e) {
		console.log("Could not get a wallet connection", e);
		return false;
	}

	// Subscribe to accounts change
	provider.on("accountsChanged", (accounts) => {
		console.log(accounts);
	});

	// Subscribe to chainId change
	provider.on("chainChanged", (chainId) => {
		console.log(chainId);
	});

	// Subscribe to networkId change
	provider.on("networkChanged", (networkId) => {
		console.log(networkId);
	});

	await fetchAccountData();

	return true;
}

async function fetchAccountData() {
	// Get a Web3 instance for the wallet
	const web3 = new Web3(provider);

	console.log("Web3 instance is", web3);

	// Get connected chain id from Ethereum node
	const chainId = await web3.eth.getChainId();
	console.log(chainId);
	// Load chain information over an HTTP API

	// Get list of accounts of the connected wallet
	const accounts = await web3.eth.getAccounts();

	// MetaMask does not give you all accounts, only the selected account
	console.log("Got accounts", accounts);
	currentAccount = accounts[0];
}

const WalletConnected = () => (
	<div className={styles.connectedContainer}>{currentAccount}</div>
);

const WalletConnectButton = () => {
	const [connectedAccount, setConnectedAccount] = useState("");

	return connectedAccount === "" ? (
		<button
			onClick={() => {
				let response = onConnect();
				setConnectedAccount(response);
			}}
			id={styles.WalletConnectButton}
		>
			Connect Wallet
		</button>
	) : (
		<WalletConnected></WalletConnected>
	);
};

export default WalletConnectButton;
