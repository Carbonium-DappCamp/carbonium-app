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
	const connected = useRef(false);
	const chainId = useRef();
	const provider = useRef();

	// Set connected status
	useEffect(() => {
		if (provider.current !== undefined) {
			connected.current = true;
		} else {
			connected.current = false;
		}
		console.log("Connection status: ", connected.current);
		console.log("Current provider: ", provider.current);
	});

	// Attempt to reconnect to wallet on reload
	useEffect(() => {
		(async () => {
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
			connected.current = true;
			fetchAccountData();
		});

		provider.current.on("disconnect", () => {
			onDisconnect();
		});
	}

	// Currently not called by anything
	async function onDisconnect() {
		console.log(connected.current);
		console.log("Killing the wallet connection", provider);
		//await provider.current.close();

		// If the cached provider is not cleared,
		// WalletConnect will default to the existing session
		// and does not allow to re-scan the QR code with a new wallet.
		// Depending on your use case you may want or want not his behavir.
		connected.current = false;
		setAccounts(null);
		web3Modal.clearCachedProvider();
		provider.current = null;
	}

	return (
		<>
			<button
				onClick={onConnect}
				className={styles.button}
				id={connected.current ? styles.connected : styles.disconnected}
			>
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
