import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./auth/Login";
import { WheelComponent } from "./components/Wheel";
import { ProtectedRoute } from "./components/ProtectedRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/ruleta"
          element={
            <ProtectedRoute>
              <WheelComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
