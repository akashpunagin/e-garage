import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

import { Box, Button, TextField, Typography } from "@mui/material";

import { SideImage } from "./SideImage";

function SignUpForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const history = useHistory();

  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    console.log("Sign up", { email, password, confirmPassword });

    if (password !== confirmPassword) {
      alert("Passwards do not match");
      return;
    }

    const { error } = await signup({ email, password });
    if (error) {
      console.log({ error });
      alert(`Log in error: ${error.message}`);
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
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="Conform Password"
        type="password"
        name="confirm-password"
        autoFocus
        inputRef={confirmPasswordRef}
      ></TextField>
      <Button type="submit" fullWidth variant="contained">
        Sign Up
      </Button>
    </Box>
  );
}

function NavigationComponent() {
  return (
    <Typography component="h3" variant="p">
      Already have an Account? <Link to="/login">Log In</Link>
    </Typography>
  );
}

export function SignUp() {
  return (
    <SideImage
      label="Sign Up"
      formComponent={SignUpForm}
      navigationComponent={NavigationComponent}
    ></SideImage>
  );
}
