import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

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

  const socialProviders = [
    { icon: <FcGoogle />, label: "Sign up with Google" },
    { icon: <FaFacebook className="text-blue-800" />, label: "Sign up with Facebook" },
    { icon: <FaApple />, label: "Sign up with Apple" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f9f9",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 460,
          p: 4,
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: 3,
        }}
      >
        <Box mb={4}>
          <Typography variant="overline">LET'S GET YOU STARTED</Typography>
          <Typography variant="h5">Create an account</Typography>
        </Box>

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

        <Divider sx={{ my: 3 }}>Or</Divider>

        {socialProviders.map(({ icon, label }, idx) => (
          <Button
            key={idx}
            fullWidth
            variant="outlined"
            sx={{
              py: 1.5,
              borderRadius: 2,
              mb: 2,
              textTransform: "none",
              justifyContent: "flex-start",
              pl: 6,
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", left: 16, fontSize: 20 }}>
              {icon}
            </Box>
            {label}
          </Button>
        ))}

        <Typography variant="body2" align="center" mt={2}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;

