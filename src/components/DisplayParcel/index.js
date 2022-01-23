import './styles.css';

function DisplayParcel({ parcel }) {
  return (
    <div className="container">
      {parcel["id"]}
      {parcel["country"]}
      {parcel["title"]}
      {parcel["description"]}
      {parcel["area"]}
    </div>
  );
}

export default DisplayParcel;
