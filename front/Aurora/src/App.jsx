import { useEffect } from "react";
import Conversation from "./pages/conversation";
import RAG from "./pages/rag";
import { connectToMessagesWS, connectToTitelsWS } from "./redux/wsActions";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./hooks/use-theme.jsx";
import { autoLogout, isTokenExpired } from "./redux/authSlice";
import PortectedRoutes from "./utils/PortectedRoutes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { fetchVitals } from "./redux/signsSlice";
import Unauthorized from "./components/layout/Unauthorized";
import { AppLayout } from "./components/layout/AppLayout";

function App() {
  const dispatch = useDispatch();

  const websocketMessagesconnected = useSelector(
    (state) => state.websocketMessages.connected
  );
  const websocketTitlesconnected = useSelector(
    (state) => state.websocketTitles.connected
  );

  useEffect(() => {
    if (!websocketMessagesconnected) {
      dispatch(connectToMessagesWS());
    }
  }, [dispatch, websocketMessagesconnected]);

  useEffect(() => {
    if (!websocketTitlesconnected) {
      dispatch(connectToTitelsWS());
    }
  }, [dispatch, websocketTitlesconnected]);

  const { accessToken } = useSelector((state) => state.auth);

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
    <ThemeProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/conversation" replace />} />

        {/* Protected routes with shared layout */}
        <Route element={<PortectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/rag" element={<RAG />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
