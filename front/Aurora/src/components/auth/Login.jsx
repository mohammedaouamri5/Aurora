import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import { MoonLoader } from "react-spinners";
import { AuthLayout } from "./AuthLayout";
import { DemoUsers } from "./DemoUsers";

const Login = () => {
  const dispatch = useDispatch();
  const { error, authStatus } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (prevData[name] === value) return prevData;
      return { ...prevData, [name]: value };
    });
  };

  const handleDemoSelect = (user) => {
    setFormData({ email: user.email, password: user.password });
    setEmailError("");
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!formData.email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!formData.password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      dispatch(login({ email: formData.email, password: formData.password }));
    }
  };

  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title="Log In to your Account"
      footer={
        <>
          You don't have an account?{" "}
          <Link to="/signup" style={{ color: "inherit", fontWeight: 700 }}>
            Signup
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="email"
          label="Email"
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(emailError)}
          helperText={emailError}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(passwordError)}
          helperText={passwordError}
          margin="normal"
        />

        {error && error.length > 0 ? (
          <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          ""
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
        >
          {authStatus === "loading" ? (
            <MoonLoader color="#ffffff" loading size={20} speedMultiplier={1} />
          ) : (
            "Continue"
          )}
        </Button>

        <DemoUsers onSelect={handleDemoSelect} />
      </form>
    </AuthLayout>
  );
};

export default Login;
