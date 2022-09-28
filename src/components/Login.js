import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    // TODO add login logic
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input-email">Email</label>
        <input id="input-email" type="email" ref={emailRef}></input>

        <label htmlFor="input-password">Email</label>
        <input id="input-password" type="password" ref={passwordRef}></input>

        <br></br>

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </React.Fragment>
  );
}
