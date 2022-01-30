import { ethers } from "ethers";

async function getAccount() {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const accounts = await provider.listAccounts();
	return accounts ? accounts[0] : null;
}

function getContract(contractAddr, artifact) {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddr, artifact.abi, signer);
	return contract;
}

async function transferParcel(toAddr) {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const gasPrice = provider.getGasPrice();
	const signer = provider.getSigner();

	await signer.sendTransaction({
		to: toAddr,
		value: 0,
		gasPrice: gasPrice,
		gasLimit: ethers.utils.hexlify(100000),
	});
}

async function getNFTBalance() {}

export { getAccount, getContract, transferParcel };
