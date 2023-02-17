import React, { useRef } from "react";
import { useHistory, Link } from "react-router-dom";

import { SideImage } from "./SideImage";
import { useAuth } from "../../contexts/Auth";

import { Box, Button, TextField, Typography } from "@mui/material";

function LogInForm() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const history = useHistory();

  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    console.log("Login", { email, password });

    const { error } = await login({ email, password });

    if (error) {
      alert(`Log in error: ${error}`);
      return;
    }

    history.push("/");
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ m: 3 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        type="text"
        name="email"
        autoComplete="email"
        autoFocus
        inputRef={emailRef}
      ></TextField>
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="Password"
        type="password"
        name="password"
        autoFocus
        inputRef={passwordRef}
      ></TextField>
      <Button type="submit" fullWidth variant="contained">
        Log In
      </Button>
    </Box>
  );
}

function NavigationComponent() {
  return (
    <Typography component="h3" variant="p">
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </Typography>
  );
}

export function Login() {
  return (
    <SideImage
      label="Login"
      formComponent={LogInForm}
      navigationComponent={NavigationComponent}
    ></SideImage>
  );
}
