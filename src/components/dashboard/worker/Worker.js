import { DashboardSkeleton } from "../DashboardSkeleton";

function Component() {
  return <h1>Worker</h1>;
}

export function Worker() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
