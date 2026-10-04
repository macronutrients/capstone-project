import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PetCollection from "./pages/PetCollection";
import HabitDetail from "./pages/HabitDetail";

function App() {
  return (
    // Makes navigation possible between different frontend URLs.
    <BrowserRouter>
      {/* Holds all of the routes for the frontend. */}
      <Routes>
        {/* Shows the login page. */}
        <Route path="/" element={<Login />} />
        {/* Shows the home page. */}
        <Route path="/home" element={<Home />} />
        {/* Shows the registration page. */}
        <Route path="/register" element={<Register />} />
        {/* Shows the user's pet collection. */}
        <Route path="/collection" element={<PetCollection />} />
        {/* Shows the details for a habit. */}
        <Route path="/habits/:id" element={<HabitDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
