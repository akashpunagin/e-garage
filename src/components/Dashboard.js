import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

export function Dashboard() {
  const { user, logout } = useAuth();

  const history = useHistory();

  async function handleLogout() {
    await logout();
    history.push("/login");
  }

  return (
    <React.Fragment>
      <h1>Dashboard</h1>
      <h3>HI user, {user?.id}</h3>
      <button onClick={handleLogout}>Logout</button>
    </React.Fragment>
  );
}
