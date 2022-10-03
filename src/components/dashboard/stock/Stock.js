import { DashboardSkeleton } from "../DashboardSkeleton";

function Component() {
  return <h1>Stock</h1>;
}

export function Stock() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
