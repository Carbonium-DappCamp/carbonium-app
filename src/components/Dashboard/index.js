import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import DisplayParcel from "../DisplayParcel";
import styles from "./styles.module.scss";
import { Pagination } from "antd";
import { getAccount } from "../../utils/common";
import "antd/dist/antd.css";

function Dashboard() {
	const [page, setPage] = useState(1);
	const [maxParcels, setMaxParcels] = useState(5);
	const [showSize, setShowSize] = useState(6);

	const {
		state: { parcel, parcels, account },
		contextService,
	} = useAppContext();

	useEffect(() => {
		(async () => {
			try {
				const acct = await getAccount();
				const size = await parcel.balanceOf(acct);
				setMaxParcels(parseInt(size));
			} catch (e) {}
		})();
	});

	useEffect(() => {
		contextService.updateParcels();
	}, [account, contextService]);

	const displayParcels = () => {
		const minIndex = page * showSize - showSize;
		const maxIndex = page * showSize;

		return parcels?.map((p, index) =>
			index < maxIndex && index >= minIndex ? (
				<DisplayParcel parcel={p} key={index} />
			) : null
		);
	};

	return (
		<div className={styles.container}>
			<h1>My Parcels</h1>
			<div className={styles.parcels}>{displayParcels()}</div>
			<Pagination
				total={maxParcels}
				onChange={(page) => {
					setPage(page);
				}}
				onShowSizeChange={(current, size) => {
					setPage(current);
					setShowSize(size);
				}}
				defaultPageSize={6}
				showSizeChanger={true}
				pageSizeOptions={[6, 10, 15]}
			></Pagination>
		</div>
	);
}

export default Dashboard;
