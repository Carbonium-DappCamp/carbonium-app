import { useState } from "react";
import { AppContextProvider } from "./contexts/AppContext";
import BaseLayout from "./components/BaseLayout";
import Dashboard from "./components/Dashboard";

const TABS = Object.freeze({
  DASHBOARD: "DASHBOARD",
});

function App() {
  const [currentTab, setCurrentTab] = useState(TABS.DASHBOARD);
  const renderTab = () => {
    switch (currentTab) {
      case TABS.DASHBOARD:
        return <Dashboard />;
      default:
        return null;
    }
  };

  return (
    <AppContextProvider>
      <BaseLayout>
        <div className="tabs">
          <button onClick={() => setCurrentTab(TABS.DASHBOARD)}>
            Dashboard
          </button>
          <button onClick={() => setCurrentTab(null)}>Get More</button>
        </div>
        {renderTab()}
      </BaseLayout>
    </AppContextProvider>
  );
}

export default App;
