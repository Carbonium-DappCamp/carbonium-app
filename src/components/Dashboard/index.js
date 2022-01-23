import { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import './styles.css';

function Dashboard() {

  const {
    state: { parcels },
    contextService,
  } = useAppContext();

  useEffect(() => {
    if (parcels === undefined) {
      contextService.getParcels();
    }
  })

  return (
    <div className="container">
      <h1>My Parcels</h1>
      {parcels?.map((p, index) => {
        return <div key={index}>
          {p["id"]}
        </div>
      })}
    </div>
  );
}

export default Dashboard;
