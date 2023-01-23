import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign_up" element={<Signup />} />
        <Route path="/sign_in" element={<Signin />} />
      </Routes>
    </div>
  );
}

export default App;
