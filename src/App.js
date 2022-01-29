import { AppContextProvider } from "./contexts/AppContext";
import BaseLayout from "./components/BaseLayout";
import Dashboard from "./components/Dashboard";

function App() {
	return (
		<AppContextProvider>
			<BaseLayout>
				<Dashboard />
			</BaseLayout>
		</AppContextProvider>
	);
}

export default App;
