import styles from './styles.module.scss';

function DisplayParcel({ parcel }) {
  return (
    <div className={styles.container}>
      {parcel["id"]}
      {parcel["country"]}
      {parcel["title"]}
      {parcel["description"]}
      {parcel["area"]}
    </div>
  );
}

export default DisplayParcel;
