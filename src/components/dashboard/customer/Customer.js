import { DashboardSkeleton } from "../DashboardSkeleton";

function Component() {
  return <h1>Customers</h1>;
}

export function Customer() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
