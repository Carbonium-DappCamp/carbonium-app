import BaseLayout from "./components/BaseLayout";
import { AppContextProvider } from "./contexts/AppContext";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <BaseLayout></BaseLayout>
      </div>
    </AppContextProvider>
  );
}

export default App;
