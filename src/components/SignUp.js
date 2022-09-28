import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

export function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const history = useHistory();

  const { signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const { error } = await signUp({ email, password });

    if (error) {
      alert(`Sign Up error: ${error}`);
    } else {
      history.push("/");
    }
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input-email">Email</label>
        <input id="input-email" type="email" ref={emailRef}></input>

        <label htmlFor="input-password">Password</label>
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
