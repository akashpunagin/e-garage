import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useAuth } from "../contexts/Auth";

import { Button, CssBaseline, TextField } from "@mui/material";

function LogInForm() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const history = useHistory();

  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    console.log({ email, password });

    const { error } = await login({ email, password });

    if (error) {
      alert(`Log in error: ${error}`);
    } else {
      history.push("/");
    }
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

export function Login() {
  return (
    <Grid container sx={{ height: "100vh" }} component="main">
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={3}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Grid>
      <Grid item xs={12} sm={9} md={5} component={Paper} elevation={5}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <LogInForm></LogInForm>
          <Typography component="h3" variant="p">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
