import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

export function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    // TODO add sign up logic
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input-email">Email</label>
        <input id="input-email" type="email" ref={emailRef}></input>

        <label htmlFor="input-password">Email</label>
        <input id="input-password" type="password" ref={passwordRef}></input>

        <br></br>

        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account, <Link to="/login">Log In</Link>
      </p>
    </React.Fragment>
  );
}
