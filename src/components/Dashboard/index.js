import { useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import DisplayParcel from "../DisplayParcel";
import styles from "./styles.module.scss";

function Dashboard() {
	const {
		state: { parcels, account },
		contextService,
	} = useAppContext();

	useEffect(() => {
		contextService.updateParcels();
	}, [account, contextService]);

	return (
		<div className={styles.container}>
			<h1>My Parcels</h1>
			<div className={styles.parcels}>
				{parcels?.map((p, index) => (
					<DisplayParcel parcel={p} key={index} />
				))}
			</div>
		</div>
	);
}

export default Dashboard;
