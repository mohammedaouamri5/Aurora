import React, { useEffect, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AuthLayout } from "./AuthLayout";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isAuthenticated, authStatus } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.userName) newErrors.userName = "User name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(
        signup({
          Email: formData.email,
          Password: formData.password,
          Name: formData.userName,
        })
      );
    }
  };

  useEffect(() => {
    if (authStatus === "success" && isAuthenticated) {
      navigate("/conversation");
    }
  }, [authStatus, isAuthenticated]);

  return (
    <AuthLayout
      eyebrow="LET'S GET YOU STARTED"
      title="Create an account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "inherit", fontWeight: 700 }}>
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          error={!!errors.userName}
          helperText={errors.userName}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
        >
          GET STARTED
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
