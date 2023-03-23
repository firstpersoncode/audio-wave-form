import connectClient from "prisma/client";
import DashboardContextProvider from "context/Dashboard";
import getDashboard from "services/dashboard";
import Dashboard from "components/Dashboard";

export default function Home({ dashboard }) {
  return (
    <DashboardContextProvider context={dashboard}>
      <Dashboard />
    </DashboardContextProvider>
  );
}

export async function getServerSideProps() {
  const dashboard = await connectClient(getDashboard);
  return { props: { dashboard } };
}
