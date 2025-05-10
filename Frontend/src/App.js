import { useState, createContext } from "react";
import "./styles/App.css";
import Video from "./components/Video";
import SpeedDisplay from "./components/SpeedDisplay";
import { SpeedProvider } from "./components/speedCalcualtor";
import Loading from "./pages/Loading";
import Menu from "./pages/Menu";

export const captureProv = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [capture, setCapture] = useState(false);

  setTimeout(() => {
    setLoading(false);
  }, 5000);

  return (
    <div className="App">
      <captureProv.Provider value={{ capture, setCapture }}>
        <SpeedProvider>
          {loading ? (
            <Loading />
          ) : !capture ? (
            <Menu />
          ) : (
            <div
              className="container-fluid bg-dark"
              style={{ minHeight: "100vh" }}
            >
              <Video />
              <SpeedDisplay />
            </div>
          )}
        </SpeedProvider>
      </captureProv.Provider>
    </div>
  );
}

export default App;
