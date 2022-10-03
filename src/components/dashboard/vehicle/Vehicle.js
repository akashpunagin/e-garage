import { DashboardSkeleton } from "../DashboardSkeleton";

function Component() {
  return <h1>Vehicle</h1>;
}

export function Vehicle() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
