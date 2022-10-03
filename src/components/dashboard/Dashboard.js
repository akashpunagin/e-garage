import { DashboardSkeleton } from "./DashboardSkeleton";

function Component() {
  return <h1>Dashboard</h1>;
}

export function Dashboard() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
