import styles from "./styles.module.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

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
	const [connected, setConnected] = useState(false);
	const chainId = useRef();
	const provider = useRef();

	// Set connected status
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (provider.current === null || provider.current === undefined) {
			setConnected(false);
		} else {
			setConnected(true);
		}
		console.log("Connection status: ", connected);
		console.log("Current provider: ", provider.current);
	});

	// Attempt to reconnect to wallet on reload
	// TODO: Fix caching so wallet will reconnect on reload without automatically triggering the modal onLoad to new users
	useEffect(() => {
		(async () => {
			(async function () {
				if (web3Modal.cachedProvider) {
					try {
						provider.current = await web3Modal.connect();
					} catch (e) {
						console.log("Could not get a wallet connection", e);
						return;
					}
					listenForWalletChanges();
					await fetchAccountData();
				}

				// From:
				// Get the cached provider from LocalStorage
				// const cachedProviderName = JSON.parse(
				// 	localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")
				// );
				// console.log(cachedProviderName);
				// console.log(web3Modal);
				// Get the connector for the cachedProviderName
				// const connector = await web3Modal.providerController.providerOptions[
				// 	cachedProviderName
				// ].connector();
				// // Evaluate connector() which returns a Proxy in the case of MetaMask
				// const proxy = await connector(); // Some connector may need providerPackage and opts
				// console.log("Proxy", proxy);
				// // Get the working provider from your favorite library (ethers, web3, ...)
				// const provider = new ethers.providers.Web3Provider(proxy); // If you use web3, then const web3 = new Web3(proxy);
				// console.log("Provider", provider);
				// // You can list the connected accounts without launching Web3Modal
				// console.log("Accounts", await provider.listAccounts()); // If you use web3, then await web3.eth.getAccounts();
			})();
		})().catch((err) => {
			console.error(err);
		});
	}, []);

	async function fetchAccountData() {
		// Get a Web3 instance for the wallet
		const web3 = new Web3(provider.current);

		console.log("Web3 instance is", web3);

		// Get connected chain id from Ethereum node
		const _chainId = await web3.eth.getChainId();
		console.log(_chainId);

		const _accounts = await web3.eth.getAccounts();

		// MetaMask does not give you all accounts, only the selected account
		console.log("Got accounts", _accounts);
		setAccounts(_accounts);
	}

	async function onConnect() {
		console.log("Opening a dialog", web3Modal);
		try {
			provider.current = await web3Modal.connect();
		} catch (e) {
			console.log("Could not get a wallet connection", e);
			return;
		}
		listenForWalletChanges();

		await fetchAccountData();
	}

	async function listenForWalletChanges() {
		console.log("Current provider is", provider.current);

		// Subscribe to accounts change
		provider.current.on("accountsChanged", (_accounts) => {
			setAccounts(_accounts);
			console.log("Accounts changed to: ", accounts);
		});

		// Subscribe to chainId change
		provider.current.on("chainChanged", (_chainId) => {
			chainId.current = _chainId;
			console.log("ChainID changed to: ", chainId);
		});

		provider.current.on("connect", () => {
			//setConnected(true);
			fetchAccountData();
		});

		provider.current.on("disconnect", (e) => {
			console.log(e);
			onDisconnect();
		});
	}

	// Currently not called by anything
	async function onDisconnect() {
		console.log("Killing the wallet connection", provider);
		//await provider.current.disconnect;

		// If the cached provider is not cleared,
		// WalletConnect will default to the existing session
		// and does not allow to re-scan the QR code with a new wallet.
		// Depending on your use case you may want or want not his behavir.
		setAccounts(null);
		provider.current = null;
		web3Modal.clearCachedProvider();
		//setConnected(false);
	}

	const accountTrimmer = () => {
		try {
			return (
				accounts[0].substring(0, 5) +
				"..." +
				accounts[0].substring(accounts[0].length - 4, accounts[0].length)
			);
		} catch (e) {
			return "";
		}
	};

	return (
		<button
			onClick={connected ? onDisconnect : onConnect}
			className={styles.button}
			id={connected ? styles.connected : styles.disconnected}
		>
			{connected ? accountTrimmer() : "Connect Wallet"}
		</button>
	);
};

export default WalletConnectButton;
