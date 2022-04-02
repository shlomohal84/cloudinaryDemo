import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Upload from "./components/Upload";
import Home from "./components/Home";
import { useState } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
require("bootstrap");

function App() {
  const [modified, setModified] = useState(false);

  return (
    <div className="App">
      <Router>
        <nav
          style={{
            display: "flex",
            margin: "auto",
            justifyContent: "space-between",
            width: "10%",
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/upload">Upload</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setModified={state => setModified(state)}
                modified={modified}
              />
            }
          />
          <Route
            path="/upload"
            element={
              !modified ? (
                <Upload
                  setModified={state => setModified(state)}
                  modified={modified}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
