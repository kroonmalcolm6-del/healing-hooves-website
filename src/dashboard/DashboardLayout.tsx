import { NavLink, Outlet } from "react-router-dom";
import { Nav } from "../components/Nav";

const TABS = [
  { to: "/dashboard/clips", label: "Clips" },
  { to: "/dashboard/charts", label: "Charts" },
  { to: "/dashboard/resources", label: "Resources" },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <h1 className="font-display text-2xl font-semibold text-soil">Your dashboard</h1>
        <div className="mt-6 flex gap-1 border-b border-soil/10">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `rounded-t-lg px-4 py-2.5 font-body text-sm font-medium transition ${
                  isActive
                    ? "border-b-2 border-redoxide text-redoxide"
                    : "text-soil/55 hover:text-soil"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </div>
    </div>
  );
}
