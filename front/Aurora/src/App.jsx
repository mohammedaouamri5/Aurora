import { use, useState } from "react";
import Conversation from "./pages/conversation";
import { connectToSocket } from "./redux/wsActions"
import UserCreation from "./User/Creation";
/*
const App = () => {
  return (
    <div>
      <UserCreation />
      <Conversation />
    </div>
  );
};

export default App;


*/



import { useEffect } from "react";
import { Routes, Route, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { autoLogout, isTokenExpired } from "./redux/authSlice";
import PortectedRoutes from "./utils/PortectedRoutes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import "./App.css";
import { fetchVitals } from "./redux/signsSlice";
// import Navbar from "./components/layout/Navbar";
// import Sidebar from "./components/layout/Sidebar";
import Unauthorized from "./components/layout/Unauthorized";

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="w-full h-full flex">
        <div className="flex-grow overflow-hidden">
          <Sidebar />
        </div>
        <main
          className={`flex-grow w-full h-[90vh] bg-lightBg ${isCalendarPage || isSessionsPage ? "p-0" : "p-8"
            } overflow-scroll custom-scrollbar`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const connected = useSelector(state => state.websocket.connected);



  useEffect(() => {
    if (!connected) { dispatch(connectToSocket()); }
  }, [dispatch]);


  const { isAuthenticated, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
     // navigate("/conversation");
    }
  }, [user, isAuthenticated]);

  const { accessToken } = useSelector((state) => state.auth);

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#0D3B66",
        contrastText: "#FFFFFF",
      },
    },
  });

  useEffect(() => {
    if (accessToken) {
      const isExpired = isTokenExpired(accessToken);
      if (isExpired) {
        dispatch(autoLogout());
      }
    } else {
      dispatch(autoLogout());
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    dispatch(fetchVitals());
  }, [dispatch]);

  return (
    <div>
      <ThemeProvider theme={customTheme}>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Protected routes with shared layout */}
          <Route element={<PortectedRoutes />}>
            <Route element={<DashboardLayout />} />
            <Route path="/conversation" element={<Conversation />} />
          </Route>

        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
