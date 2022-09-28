import React from "react";

export function Dashboard() {
  async function handleLogout() {
    // TODO add logout logic
  }

  return (
    <React.Fragment>
      <p>Dashboard</p>
      <button onClick={handleLogout}>Logout</button>
    </React.Fragment>
  );
}
