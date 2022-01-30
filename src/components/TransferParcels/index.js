import { useState } from "react";
import { ethers } from "ethers";
import { useAppContext } from "../../contexts/AppContext";
import styles from "./styles.module.scss";

const TransferParcels = () => {
	const [toAddress, setToAddress] = useState("");

	const {
		state: { parcel },
	} = useAppContext();

	const handleAddressUpdate = (e) => {
		setToAddress(e.target.value);
	};

	const transferParcel = (e) => {
		e.preventDefault();
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		parcel.connect(signer).grant(toAddress, 5);
	};

	return (
		<form onSubmit={transferParcel} className={styles.container}>
			<div>
				<label>Recipient Address: </label>
				<input
					type="text"
					name="address"
					placeholder="Enter address"
					value={toAddress}
					onChange={handleAddressUpdate}
				/>
			</div>
			<button type="submit">Submit</button>
		</form>
	);
};

export default TransferParcels;
