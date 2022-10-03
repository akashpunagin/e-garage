import { DashboardSkeleton } from "../DashboardSkeleton";

function Component() {
  return <h1>Histroy</h1>;
}

export function History() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
