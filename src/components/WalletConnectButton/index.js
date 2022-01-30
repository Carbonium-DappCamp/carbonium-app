import styles from "./styles.module.scss";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import { useAppContext } from "../../contexts/AppContext";

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
	const { contextService } = useAppContext();
	const [accounts, setAccounts] = useState(null);
	const [connected, setConnected] = useState(false);
	const chainId = useRef();
	const provider = useRef();

	useEffect(() => {
		contextService.updateParcels();
	}, [accounts, contextService]);

	// Set connected status
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (provider.current === null || provider.current === undefined) {
			setConnected(false);
		} else {
			setConnected(true);
		}
	});

	// Attempt to reconnect to wallet on reload
	useEffect(() => {
		(async () => {
			(async function () {
				if (web3Modal.cachedProvider) {
					try {
						provider.current = await web3Modal.connect();
					} catch (e) {
						console.log(
							"Could not get a wallet connection, clearing provider cache"
						);
						web3Modal.clearCachedProvider();
						return;
					}
					listenForWalletChanges();
					await fetchAccountData();
				}
			})();
		})().catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function fetchAccountData() {
		// Get a Web3 instance for the wallet
		const web3 = new Web3(provider.current);

		// Get connected chain id from Ethereum node
		const _chainId = await web3.eth.getChainId();
		chainId.current = _chainId;

		const _accounts = await web3.eth.getAccounts();

		// MetaMask does not give you all accounts, only the selected account
		setAccounts(_accounts);
	}

	async function onConnect() {
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
		const web3 = new Web3(provider.current);
		contextService.setWeb3(web3);

		// Subscribe to accounts change
		provider.current.on("accountsChanged", (_accounts) => {
			setAccounts(_accounts);
		});

		// Subscribe to chainId change
		provider.current.on("chainChanged", (_chainId) => {
			chainId.current = _chainId;
		});

		provider.current.on("connect", () => {
			fetchAccountData();
		});

		provider.current.on("disconnect", (e) => {
			onDisconnect();
		});
	}

	// Currently not called by anything
	async function onDisconnect() {
		console.log("Killing the wallet connection", provider);
		//await provider.current.disconnect;
		contextService.setWeb3(undefined);

		// If the cached provider is not cleared,
		// WalletConnect will default to the existing session
		// and does not allow to re-scan the QR code with a new wallet.
		// Depending on your use case you may want or want not his behavir.
		setAccounts(null);
		provider.current = null;
		web3Modal.clearCachedProvider();
	}

	const walletConnectedContent = () => {
		try {
			return (
				<div id={styles.walletConnectedContentContainer}>
					<div id={styles.disconnectButton} onClick={onDisconnect}>
						X
					</div>
					{accounts[0].substring(0, 5) +
						"..." +
						accounts[0].substring(accounts[0].length - 4, accounts[0].length)}
				</div>
			);
		} catch (e) {
			setConnected(false);
		}
	};

	return (
		<button
			onClick={connected ? null : onConnect}
			className={styles.button}
			id={connected ? styles.connected : styles.disconnected}
		>
			{connected ? walletConnectedContent() : "Connect Wallet"}
		</button>
	);
};

export default WalletConnectButton;
